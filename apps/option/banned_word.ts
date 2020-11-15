import { $, ApplicationError, BannedTarget, BlockType, Logger } from '../common';
import { BannedWordRepository, BannedWord } from '../repository/banned_word_repository';
import { createSelectOption } from '../util/dom';

export default class BannedWords {
    private addButton: HTMLInputElement;

    private addText: HTMLInputElement;

    private wordList: HTMLDivElement;

    constructor() {
        this.addButton = document.getElementById('bannedWordAddButton') as HTMLInputElement;
        this.addText = document.getElementById('bannedWordAddText') as HTMLInputElement;
        this.wordList = document.getElementById('bannedWordList') as HTMLDivElement;

        this.addButton.addEventListener('click', async () => {
            const word = this.addText.value;
            if (word === '') {
                return;
            }

            const added: boolean = await BannedWordRepository.add(word);
            if (added) {
                Logger.debug('add to Banned Words', word);
                this.createWidget({
                    keyword: word,
                    blockType: BlockType.SOFT,
                    target: BannedTarget.TITLE_AND_CONTENTS,
                });
            }

            this.addText.value = '';
        });
    }

    public clear(): void {
        this.wordList.innerHTML = '';
    }

    public async load(): Promise<void> {
        const words: BannedWord[] = await BannedWordRepository.load();
        this.wordList.innerHTML = '';

        for (const word of words) {
            this.createWidget(word);
        }
    }

    private createWidget(word: BannedWord): void {
        const wordDiv: HTMLDivElement = document.createElement('div');

        const input: HTMLInputElement = document.createElement('input');
        input.type = 'text';
        input.value = word.keyword;
        input.readOnly = true;
        wordDiv.appendChild(input);

        const deleteButton: HTMLInputElement = $.button($.message('bannedWordDeleteButton'));
        $.onclick(deleteButton, this.deleteKeyword.bind(this, word.keyword, wordDiv));
        wordDiv.appendChild(deleteButton);

        const typeSelect: HTMLSelectElement = createSelectOption({
            options: [
                {
                    value: 'soft',
                    message: $.message('softBlock'),
                },
                {
                    value: 'hard',
                    message: $.message('hardBlock'),
                },
            ],
            onChange: this.changeType.bind(this, word.keyword),
            selectedValue: word.blockType.toString(),
        });
        wordDiv.appendChild(typeSelect);

        const targetSelect: HTMLSelectElement = createSelectOption({
            options: [
                {
                    value: 'titleAndContents',
                    message: $.message('titleAndContents'),
                },
                {
                    value: 'titleOnly',
                    message: $.message('titleOnly'),
                },
            ],
            onChange: this.changeTarget.bind(this, word.keyword),
            selectedValue: word.target.toString(),
        });
        wordDiv.appendChild(targetSelect);

        const br = $.br();
        wordDiv.appendChild(br);

        this.wordList.appendChild(wordDiv);
    }

    private async changeType(keyword: string, ev: Event): Promise<void> {
        const typeSelect: HTMLSelectElement = ev.target as HTMLSelectElement;
        const index = typeSelect.selectedIndex;
        const { value } = typeSelect.options[index];

        switch (value) {
            case 'soft':
                await BannedWordRepository.changeType(keyword, BlockType.SOFT);
                break;
            case 'hard':
                await BannedWordRepository.changeType(keyword, BlockType.HARD);
                break;
            default:
                throw new ApplicationError(`unknown value:${value}`);
        }
    }

    private async changeTarget(keyword: string, ev: Event): Promise<void> {
        const targetSelect: HTMLSelectElement = ev.target as HTMLSelectElement;
        const index = targetSelect.selectedIndex;
        const { value } = targetSelect.options[index];

        switch (value) {
            case 'titleAndContents':
                await BannedWordRepository.changeTarget(keyword, BannedTarget.TITLE_AND_CONTENTS);
                break;
            case 'titleOnly':
                await BannedWordRepository.changeTarget(keyword, BannedTarget.TITLE_ONLY);
                break;
            default:
                throw new ApplicationError(`unknown value:${value}`);
        }
    }

    private async deleteKeyword(keyword: string, wordDiv: HTMLDivElement): Promise<void> {
        await BannedWordRepository.delete(keyword);
        this.wordList.removeChild(wordDiv);
    }
}
