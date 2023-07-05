import { ApplicationError, Logger } from "../common";
import BlockedSite from "../model/blocked_site";
import BlockedSitesRepository from "../repository/blocked_sites";

/**
 * URL field
 */
class BlockedSiteUrlField {
  public element: HTMLInputElement;

  /**
   *
   * @param {BlockedSiteOption} mediator
   * @param {string} url
   */
  constructor(mediator: BlockedSiteOption, url: string) {
    const input = document.createElement("input");
    input.setAttribute("type", "text");
    input.setAttribute("size", "100");
    this.element = input;

    this.setUrl(url);
  }

  public getElement(): Element {
    return this.element;
  }

  public value(): string | null {
    return this.element.getAttribute("data-value");
  }

  public getInputValue(): string {
    return this.element.value;
  }

  public toHard(): void {
    // do nothing
  }

  public toSoft(): void {
    // do nothing
  }

  public setUrl(url: string): void {
    this.element.setAttribute("data-value", url);
    this.element.value = url;
  }
}

/**
 * Change URL button
 */
class BlockedSiteEditButton {
  public element: HTMLInputElement;

  public mediator: BlockedSiteOption;

  /**
   *
   * @param {BlockedSiteOption} mediator
   */
  constructor(mediator: BlockedSiteOption) {
    this.mediator = mediator;

    const input = document.createElement("input");
    input.setAttribute("type", "button");
    input.setAttribute("value", chrome.i18n.getMessage("UpdateUrl"));
    input.addEventListener("click", this.onclick.bind(this));
    this.element = input;
  }

  public async onclick(): Promise<void> {
    await this.mediator.editUrl();
  }

  public getElement(): Element {
    return this.element;
  }

  public toHard(): void {
    // do nothing
  }

  public toSoft(): void {
    // do nothing
  }
}

class BlockedSiteStateButton {
  public element: HTMLInputElement;

  public mediator: BlockedSiteOption;

  public state: string;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public handler: any;

  /**
   *
   * @param {BlockedSiteOption} mediator
   * @param {string} state
   */
  constructor(mediator: BlockedSiteOption, state: string) {
    this.mediator = mediator;

    const input = document.createElement("input");
    input.setAttribute("type", "button");
    this.element = input;

    this.setState(state);
  }

  public getState(): string {
    return this.state;
  }

  public setState(state: string): void {
    this.state = state;

    this.updateLabel(state);

    this.updateBlockTypeHandler();
  }

  public updateBlockTypeHandler(): void {
    // remove handler
    if (this.handler) {
      this.element.removeEventListener("click", this.handler);
      this.handler = null;
    }

    if (this.state === "soft") {
      this.handler = this.mediator.toHard.bind(this.mediator);
    } else {
      this.handler = this.mediator.toSoft.bind(this.mediator);
    }

    // set handler
    if (this.handler) {
      this.element.addEventListener("click", this.handler);
    }
  }

  public updateLabel(state: string): void {
    if (state === "soft") {
      this.element.setAttribute(
        "value",
        chrome.i18n.getMessage("changeToHardBlock"),
      );
    } else {
      this.element.setAttribute(
        "value",
        chrome.i18n.getMessage("changeToSoftBlock"),
      );
    }
  }

  public toHard(): void {
    this.setState("hard");
  }

  public toSoft(): void {
    this.setState("soft");
  }

  public getElement(): Element {
    return this.element;
  }
}

/**
 * Delete button
 */
class BlockedSiteDeleteButton {
  public element: HTMLInputElement;

  public mediator: BlockedSiteOption;

  /**
   *
   * @param {BlockedSiteOption} mediator
   * @param {string} state
   */
  constructor(mediator: BlockedSiteOption, state: string) {
    this.mediator = mediator;

    const input = document.createElement("input");
    input.setAttribute("type", "button");
    input.setAttribute("value", chrome.i18n.getMessage("unblock"));
    input.addEventListener("click", this.onclick.bind(this));
    this.element = input;

    this.setState(state);
  }

  public async onclick(): Promise<void> {
    await this.mediator.deleteUrl();
  }

  public getElement(): Element {
    return this.element;
  }

  public setState(state: string): void {
    if (state === "hard") {
      this.toHard();
    } else {
      this.toSoft();
    }
  }

  public toHard(): void {
    // disable button.
    this.element.setAttribute("disabled", "true");
  }

  public toSoft(): void {
    // enable button.
    this.element.removeAttribute("disabled");
  }
}

/**
 * @property {BlockedSite} blockedSite
 * @property {BlockedSiteUrlField} urlField
 * @property {BlockedSiteEditButton} editButton
 */
export default class BlockedSiteOption {
  public urlField: BlockedSiteUrlField;

  public editButton: BlockedSiteEditButton;

  public stateButton: BlockedSiteStateButton;

  public deleteButton: BlockedSiteDeleteButton;

  public element: HTMLTableRowElement;

  constructor(blockedSite: BlockedSite) {
    // create Colleague
    this.urlField = new BlockedSiteUrlField(this, blockedSite.getUrl());
    this.editButton = new BlockedSiteEditButton(this);
    this.stateButton = new BlockedSiteStateButton(this, blockedSite.getState());
    this.deleteButton = new BlockedSiteDeleteButton(
      this,
      blockedSite.getState(),
    );

    // Create tr element surrounding all input fields.
    const tr = document.createElement("tr");
    tr.appendChild(document.createElement("td")).appendChild(
      this.urlField.getElement(),
    );
    tr.appendChild(document.createElement("td")).appendChild(
      this.editButton.getElement(),
    );
    tr.appendChild(document.createElement("td")).appendChild(
      this.stateButton.getElement(),
    );
    tr.appendChild(document.createElement("td")).appendChild(
      this.deleteButton.getElement(),
    );
    this.element = tr;
  }

  public getElement(): Element {
    return this.element;
  }

  public getUrl(): string {
    return this.urlField.value()!;
  }

  public getState(): string {
    return this.stateButton.getState();
  }

  public setState(state: string): void {
    switch (state) {
      case "soft":
        // send to Colleagues.
        this.urlField.toSoft();
        this.editButton.toSoft();
        this.stateButton.toSoft();
        this.deleteButton.toSoft();

        break;
      case "hard":
        // send to Colleagues.
        this.urlField.toHard();
        this.editButton.toHard();
        this.stateButton.toHard();
        this.deleteButton.toHard();

        break;
      default:
        throw new ApplicationError(`unknown state:${state}`);
    }
  }

  public setUrl(url: string): void {
    this.urlField.setUrl(url);
  }

  public async toHard(): Promise<void> {
    await BlockedSitesRepository.toHard(this.getUrl());

    this.setState("hard");

    Logger.debug("Changed to hard-block.", this.getUrl());
  }

  public async toSoft(): Promise<void> {
    await BlockedSitesRepository.toSoft(this.getUrl());

    this.setState("soft");

    Logger.debug("Changed to soft-block.", this.getUrl());
  }

  public async editUrl(): Promise<void> {
    const beforeUrl = this.urlField.value()!;
    const afterUrl = this.urlField.getInputValue();
    await BlockedSitesRepository.edit(beforeUrl, afterUrl);

    this.setUrl(afterUrl);

    Logger.debug(`Change URL: ${beforeUrl} => ${afterUrl}`);
  }

  public async deleteUrl(): Promise<void> {
    await BlockedSitesRepository.del(this.getUrl());

    this.element.parentElement!.removeChild(this.element);

    Logger.debug(`Delete URL: ${this.getUrl()}`);
  }
}
