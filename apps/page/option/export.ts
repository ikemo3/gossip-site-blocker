import { $ } from "../../libs/dom";
import { BannedWord, BannedWordRepository } from "../../storage/banned_words";
import BlockedSitesRepository from "../../storage/blocked_sites";
import { RegExpRepository } from "../../storage/regexp_repository";

async function exportClicked(): Promise<void> {
  const sites = await BlockedSitesRepository.load();

  // block
  const lines = [];
  for (const site of sites) {
    const line = `${site.url} ${site.block_type}`;
    lines.push(line);
  }

  lines.sort();

  // banned words
  const bannedLines = [];
  const words: BannedWord[] = await BannedWordRepository.load();
  for (const word of words) {
    const escaped = word.keyword.replace(/ /g, "+");
    const { blockType, target, keywordType } = word;
    const line = `${escaped} banned ${blockType} ${target} ${keywordType}`;
    bannedLines.push(line);
  }

  bannedLines.sort();

  // regexp
  const regexpLines = [];
  const regexpList = await RegExpRepository.load();
  for (const regexp of regexpList) {
    const escaped = $.escape(regexp.pattern);
    const { blockType } = regexp;
    const line = `${escaped} regexp ${blockType}`;
    regexpLines.push(line);
  }

  const allLines = lines.concat(bannedLines).concat(regexpLines);
  const exportTextArea = document.getElementById("exportTextArea");

  if (exportTextArea instanceof HTMLTextAreaElement) {
    exportTextArea.value = `${allLines.join("\n")}\n`;
  } else {
    throw new Error("exportTextArea is not HTMLTextAreaElement");
  }
}

export default exportClicked;
