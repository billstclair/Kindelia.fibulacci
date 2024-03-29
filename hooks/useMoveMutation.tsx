import { useMutation } from "@tanstack/react-query";
import kindelia from "kindelia-js";

import { setGameStore } from "../stores/gameStore";
import { FIB_CONTRACT } from "../utils/contract";
import { NODE_URL } from "../utils/env";
import { FibObject } from "./useStateQuery";

enum EventMoveEnum {
  "ArrowUp" = 0,
  "ArrowLeft" = 1,
  "ArrowDown" = 2,
  "ArrowRight" = 3,
}

export function usePlayerMoveMutation() {
  return useMutation(
    ["moveMutation"],
    ({
      player,
      eventMove,
    }: {
      player: FibObject;
      eventMove: KeyboardEvent;
    }) => {
      return kindelia
        .sendInteract({
          nodeURL: NODE_URL,
          isPublish: true,
          code: `
          run {
              let code = (
                ${FIB_CONTRACT.FIB_KDL_WALK} 
                #${EventMoveEnum[eventMove.key]} 
                #${player.num}
              );
              ask x = (Call 'Fql' {${FIB_CONTRACT.FIB_ACT_ACT} code});
              (Done x)
          }
      `,
        })
        .then((res) => {
          if (res.data[0]["Ok"] === null) {
            setGameStore({ isLoading: true, player });
          }

          return res;
        });
    }
  );
}
