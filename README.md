# 99-Puzzle
GitHub Pages:  https://bmai1.github.io/99-puzzle/
<br>
Netlify deployment: https://99puzzle.netlify.app/

This project is a spin-off of the 15-puzzle with additional features such as larger boards, an APM tracker, local best time, and audio.
It is better optimized for speedrunning as there are no tile animations, which allows for frame-lossless rotations. Solving algorithms (A*, BFS) are included, but checking board states past 10 moves crashes the browser as it is too slow.


## Objective: 
The location of each tile on the board is shuffled every game. Rearrange the numbers by shifting tiles into the empty cell and form an increasing sequence as fast as possible. There are no penalties for "incorrect moves", but certain sequences of inputs will order the board more efficiently than others.

## Controls: 
Arrow keys will move adjacent tiles into the empty cell. WASD is supported as well, but not recommended. Background music
can be toggled via the audio player, and move sfx is selected with the dropdown menu. Clicking "New Game" will shuffle the
board and reset the timer. 


## Preview Images:

![demo](/preview/browserview.png)

![demo 5x5 board](/preview/demo5x5.png)

![demo 10x10 board](/preview/demo10x10.png)

![demo victory popup](/preview/demo_stats.png)

## Playthrough Example: 

https://github.com/bmai1/99puzzle/assets/104703637/7badc2f4-0858-4f1c-83d0-9324d4d74cf5

Credit to [Shubham Singh](https://github.com/imshubhamsingh/15-puzzle/commit/e016ad30a9560d2450618a99e9e5b218123f50ae#diff-8478a7bac0240dc851826c916a23b44e3e318bf3e480424aea77d533e1d770fe) for puzzle solvability (parity) function, and [Jamie Wong](https://github.com/jlfwong/fifteen-puzzle) for solving algorithm inspiration.
