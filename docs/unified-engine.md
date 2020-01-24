---
id: unified-engine
title: Unified game engine on Linux
sidebar_label: Unified game engine
---

# Problem
Games need to be published to different Linux seatback devices. The devices may differ in the following aspects:
- Audio support: Audio playback can be based on SDLmixer, SDL2Mixer or fmod. 
- Rendering support: Rendering can be based on OpenGL-ES, SDL1 frame buffer, SDL2 frame buffer.
- Game runtime management: The game needs to implement certain APIs so as to respond to events, such as pause, resume, prompting announcements. On some devices, there are special button to be responded. The APIs are under continuous development. Some APIs may need to be supported when there is a delivery request.
- CPU architecture: arm and x86 can be supported.
The test of games needs to be very efficient. The test of games has the following procedure:
![Game test procedure](assets/unified-engine/game-test-procedure.png)
The test of games have 4 steps. Self test and internal test results can be updated to game developer instantly, but simulated delivery test and online delivery test results have a delay of 11 hours to be updated to the developer. Online delivery test has only 1 or 2 tries. If certain game doesn’t pass on the second test, it misses a chance to be delivered. Many months later there may be another chance. With each delivery, several games need to be delivered. If one of them doesn’t pass the test, then none of the games can be delivered. Simulated delivery test and online delivery test have very title schedule, which is typically one week. Simulated delivery test cannot be done in advance because the environment is in continuous development too. When the environment is released, there are not much time left for game developer to catch up with the final delivery schedule.
## Legacy game development
Upon request of a new game, different copies of games are developed on different game engines. Game engines needing support are cocos2dx-1, SDL1 and SDL2.
![](assets/unified-engine/legacy-development-management.png)
### Game development procedure
![](assets/unified-engine/legacy-development.png)

### Problem of legacy game development procedure
- It’s inefficient and boring to work on one game for several times.
- The effort to maintaining a game is painful and time consuming. For example, if a bug is found in one version of the game, it needs to be fixed for all versions.
- It severely violates the “Donot Repeat Yourself (DRY)” idiom which is a well-known practice of programming.
- The extension if poor. It takes much effort to support another game engine.
- The delivery process is inefficient and time consuming and error prone.

## Legacy delivery procedure
The delivery procedure can be illustrated as bellow.
![](assets/unified-engine/legacy-game-delivery-procedure.png)
The building of games depend on the building of all possible combinations of CPU architecture, rendering technique, audio support and runtime API. These are all sequentially dependent. Therefore, at most there can be 2(CPU architectures) * 3(audio) * 3(rendering) * 4(runtime API) = 48 builds of game dependencies, as illustrated bellow.
| CPU arch |	Audio	| Rendering	| Runtime |	Total |
| :---: | :---: | :---: | :---: | :---: |
|2	| 3	| 3	| 4 | 	2x3x3x4=48|
Although in practice, the number would be 2 or 4 or 8. Typically, the building of one type of dependency takes about an hour. To make delivery clean, each delivery of games will require a clean build of the dependencies and games.

The problem are:
- The building process is too time consuming.
- One error in certain step may require some change to code, which will take a lot of time to rebuild all dependencies.

# Solution
The components are refactored to the following structure. Most of the implementations a put to separate dynamically loaded modules, as illustrated bellow.
![ ](assets/unified-engine/refined-game-management.png)
## Refined game development
Only one copy of game code is developed based on refined cocos2dx-1.
![ ](assets/unified-engine/refined-development.png)
## Refined delivery procedure
![ ](assets/unified-engine/refined-delivery-procedure.png)
In the refined delivery procedure illustrated above, the building of games doesn’t depend on building of dependencies. Also, there is no sequential dependence among the rendering support, audio support and runtime support. The game dependencies and games are composed so as to run in the release step.

# Realization

## Classes
Cocos2dx-1 engine is refined to support APIs. Three API interfaces are added, namely IRuntimePort, IRenderPort and IAudioPort. Also, a singleton ApiMananer is added to manage the implementations of the interfaces. Each implementation if built to a dynamically loaded library.
![](assets/unified-engine/classes.png)
## Sequences

## Loading of modules
![](assets/unified-engine/loading_of_dependencies.png)
# Analysis of the refinement
## Improvement
1. The game development and maintenance if highly improved. Currently, 3 engines are supported, so the refined is 3 times more efficient than the legacy method.
2. The building procedure is more efficient and more robust. If there is a bug in certain module, only that module has to be rebuilt. The refined building time of a delivery is about an hour.
3. The test is more efficient. Since the game dependencies are dynamically decided, with modifiable configuration, the tester can test with different configurations without having to build another binary.
4. Support of new requirement is much easier. Just add a new module.
## Issues
Having delivered successfully over 5 times, no issue is found up till now.

