import React from "react";
import {
  GiFishMonster,
  GiSwordwoman,
  GiArrowCursor,
  GiSwordWound,
  GiArrowsShield,
  GiChest,
} from "react-icons/gi";
import {
  LuArrowUpSquare,
  LuArrowLeftSquare,
  LuArrowDownSquare,
  LuArrowRightSquare,
} from "react-icons/lu";

const Rules = () => {
  return (
    <div className="rules-page">
      <header style={{ display: "flex" }}>
        <GiSwordwoman className="rules-page-header-icon" />
        <h1>HOW TO PLAY</h1>
        <GiFishMonster className="rules-page-header-icon" />
      </header>
      <p>
        <b>WELCOME TO DUNGEON THROWDOWN!</b> This is a turn-based RPG-style
        boardgame for two players. Use stragety, luck, and powerups to fight
        your opponent and reduce their Hit Points <em>(health)</em> to zero!
      </p>
      <p>
        <b>YOUR TURN:</b> A turn consists of two phases, Movement and Action. To
        move to an adjacent tile{" "}
        <em>(one above, below, or to the side of you)</em>, you can{" "}
        <GiArrowCursor /> click on that tile OR press the cooresponding{" "}
        <span style={{ fontSize: 24 }}>
          <LuArrowUpSquare />
          <LuArrowLeftSquare />
          <LuArrowDownSquare />
          <LuArrowRightSquare />
        </span>{" "}
        key or{" "}
        <code>
          <b>WASD</b>
        </code>{" "}
        key. You may move up to the number of tiles indicated by the Movement
        Dice that are rolled as your turn starts. You can also take ONE action
        per turn <em>(Attacking or Opening a Box)</em>.
        <ul>
          <li>
            You can choose to move and act in either order, but you can't split
            up your movement around taking an action. Turns will end
            automatically if you can't do anything else, but you can also choose
            to end early with the "End Turn" button.
          </li>
        </ul>
      </p>
      <p>
        <b>COMBAT:</b> To attack your opponent, move to an adjacent tile and
        click on their tile. Each of you then rolls Battle Dice, equal to your
        Attack or Defense Dice. Each{" "}
        <GiSwordWound className="battle-die demo-die" /> Sword that you roll is
        a success for you, and each{" "}
        <GiArrowsShield result="def" className="battle-die demo-die" /> Shield
        that they roll is a success for them. For every success you roll that
        exceeds theirs, they take 1 damage, reducing their Hit Points by that
        amount. If the opponent's Hit Points reach zero, you win!
      </p>
      <p>
        <b>BOXES:</b> Items and powerups can be found in{" "}
        <GiChest style={{ color: "rgb(221, 196, 162)", fontSize: 28 }} /> boxes
        that appear around the board. Move to an adjacent square and click on a
        box to open it. If the box isn't empty (!), you'll get a one-time use
        item or a powerup. A powerup will boost your Attack or Defense, but will
        be lost as soon as you take damage. You can only have one powerup at a
        time, so open boxes strategically!
      </p>
    </div>
  );
};

export default Rules;
