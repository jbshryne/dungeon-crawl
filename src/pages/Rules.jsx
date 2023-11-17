import React from "react";
import { GiFishMonster, GiSwordwoman } from "react-icons/gi";

const Rules = () => {
  return (
    <div className="rules-page">
      <h1>
        <GiSwordwoman /> HOW TO PLAY <GiFishMonster />
      </h1>
      <p>
        <b>WELCOME TO DUNGEON THROWDOWN!</b> This is a turn-based RPG-style
        boardgame for two players. Use stragety and luck to fight your opponent
        and reduce their Hit Points <em>(health)</em> to zero.
      </p>
      <p>
        <b>YOUR TURN:</b> A turn consists of two phases, Movement and Action. To
        move to an adjecnt tile <em>(above, below, or to the side of you)</em>,{" "}
        you can click on the tile OR use the cooresponding arrow or 'WASD' key.
        You may move up to the number of tiles indicated by the Movement Dice
        that are rolled as your turn starts. You can also take ONE action per
        turn <em>(Attacking or Opening a Box)</em>. You can choose to move and
        act in either order (or choose not to do either of them), but you can't
        split up your movement around taking an action.
      </p>
      <p>
        <b>COMBAT:</b> To attack your opponent, move to an adjacent tile and
        click on their tile. Each of you then rolls Battle Dice, equal to your
        Attack or Defense Dice. Each Sword that you roll is a success for you,
        and each Shield that they roll is a success for them. For every success
        you roll that exceeds theirs, they take 1 damage, reducing their Hit
        Points by that amount. If the opponent's Hit Points reach zero, you win!
      </p>
      <p>
        <b>BOXES:</b> Item and powerups can be found in boxes that appear around
        the board. Move to an adjacent square and click on a box to open it. If
        the box isn't empty (!), you'll get a one-time use item or a powerup. A
        powerup will boost your Attack or Defense, but will be lost as soon as
        you take damage. You can only have one powerup at a time, so open boxes
        strategically!
      </p>
    </div>
  );
};

export default Rules;
