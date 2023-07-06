# 99-Puzzle
This project is a parody of the 15-puzzle with more features such as an APM tracker, best time with localStorage, and audio.
It is better optimized for speedrunning as there are no tile animations, which allows for frame-lossless rotations.


## Objective: 
The numbers on the board are randomized every game. Rearrange the numbers into an increasing sequence as fast as possible.
There are no "incorrect moves", but some sequences of inputs will order the board more efficiently than others.

## Controls: 
Arrow keys will move adjacent tiles into the empty cell. WASD is supported as well, but not recommended. Background music
can be toggled via the audio player, and move sfx is selected with the dropdown menu. Clicking "New Game" will shuffle the
board and reset the timer. 


## Preview Images:

![demo](/preview/demo.png)

![demo 4x4 board](/preview/demo4x4.png)

![demo 5x5 board](/preview/demo5x5.png)

![demo 10x10 board](/preview/demo10x10.png)

![demo victory popup](/preview/demo_stats.png)

![demo victory screen](/preview/demo_win.png)

## Playthrough Example: 

https://github.com/bmai1/99puzzle/assets/104703637/7badc2f4-0858-4f1c-83d0-9324d4d74cf5

Credit goes to [Shubham Singh](https://github.com/imshubhamsingh/15-puzzle/commit/e016ad30a9560d2450618a99e9e5b218123f50ae#diff-8478a7bac0240dc851826c916a23b44e3e318bf3e480424aea77d533e1d770fe) for the parity function to ensure puzzle solvability.
