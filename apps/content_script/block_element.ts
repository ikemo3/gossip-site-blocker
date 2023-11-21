import { BlockReason } from "../model/block_reason";
import { MenuPositionType } from "../storage/enums";
import { Options } from "../storage/options";
import { BlockMediator, BlockMediatorType } from "./block_mediator";
import BlockState, { ContentToBlockType } from "./block_state";

type SearchResultToBlockType = ContentToBlockType &
  BlockMediatorType & {
    canRetry: () => boolean;
    canBlock: () => boolean;
    deleteElement: () => void;
    getMenuPosition: (defaultPosition: MenuPositionType) => MenuPositionType;
  };

export function blockElement(
  g: SearchResultToBlockType,
  options: Options,
): { ended: boolean; reason?: BlockReason } {
  if (!g.canRetry()) {
    return { ended: true };
  }

  if (!g.canBlock()) {
    return { ended: false };
  }

  const blockState: BlockState = new BlockState(
    g,
    options.blockedSites,
    options.bannedWords,
    options.regexpList,
    options.autoBlockIDN,
  );

  const reason = blockState.getReason();

  if (blockState.getState() === "hard") {
    g.deleteElement();
    return { ended: true, reason };
  }

  const menuPosition = g.getMenuPosition(options.menuPosition);

  const _ = new BlockMediator(
    g,
    blockState,
    options.defaultBlockType,
    menuPosition,
  );

  return { ended: true, reason };
}
