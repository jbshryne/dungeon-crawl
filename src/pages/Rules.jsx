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
        your opponent and reduce their Hit Points to zero!
      </p>
      <p>
        <b>YOUR TURN:</b> Each turn has two phases, a Movement and an Action. To
        move to an adjacent tile{" "}
        <em>(i.e. one above, below, or to the side of you)</em>, you can{" "}
        <GiArrowCursor /> click on that tile OR press the corresponding{" "}
        <span style={{ fontSize: 24 }}>
          <LuArrowUpSquare />
          <LuArrowLeftSquare />
          <LuArrowDownSquare />
          <LuArrowRightSquare />
        </span>{" "}
        (or{" "}
        <code>
          <b>WASD</b>
        </code>
        ) key. The max number of tiles you can move each turn is determined by
        your Movement Roll. You can also choose to do ONE action each turn, like
        Attacking or Opening a Box.
        <ul>
          <li>
            You can choose to move or act in either order, but you can't split
            up your movement around taking an action. Turns will end
            automatically if you can't do anything else, but you can choose to
            end at any time with the "End Turn" button (or by pressing{" "}
            <code>
              <b>E</b>
            </code>{" "}
            or{" "}
            <code>
              <b>[ENTER]</b>
            </code>
            ).
          </li>
        </ul>
      </p>
      <p>
        <b>COMBAT:</b> To attack your opponent, move to an adjacent tile and
        click on their tile. Each of you then rolls Battle Dice, equal to your
        current number of Attack / Defense Dice. Each{" "}
        <GiSwordWound className="battle-die demo-die" /> Sword that you roll is
        a success for you, and each{" "}
        <GiArrowsShield result="def" className="battle-die demo-die" /> Shield
        that they roll is a success for them. If your successes exceed theirs,
        they take damage and lose that many Hit Points. If the opponent's Hit
        Points reach zero, you win!
      </p>
      <p>
        <b>BOXES:</b> Items and powerups can be found in{" "}
        <GiChest style={{ color: "rgb(221, 196, 162)", fontSize: 28 }} /> boxes
        that appear around the board. Move to an adjacent square and click on a
        box to open it. If the box isn't empty (!), you'll either get a one-time
        use item or a powerup. A powerup will boost your Attack or Defense, but
        if your opponent hits you, the powerup will absorb 1 point of damage and
        then be lost. You can only have one powerup at a time, so open boxes
        strategically!
      </p>
    </div>
  );
};

export default Rules;
