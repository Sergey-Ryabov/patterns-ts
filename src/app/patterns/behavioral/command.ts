/**
 * Command (Команда) — это поведенческий паттерн, позволяющий заворачивать запросы или простые операции в отдельные объекты.
 * Паттерн позволяет откладывать выполнение команд, выстраивать их в очереди, а также хранить историю и делать отмену.
 * Команда устанавливает косвенную одностороннюю связь от отправителей к получателям.
 *
 * Преимущества
 * - Убирает прямую зависимость между объектами, вызывающими операции, и объектами, которые их непосредственно выполняют.
 * - Позволяет реализовать простую отмену и повтор операций.
 * - Позволяет реализовать отложенный запуск операций.
 * - Позволяет собирать сложные команды из простых.
 * - Реализует принцип открытости/закрытости.
 *
 * Недостатки:
 * - Усложняет код программы из-за введения множества дополнительных классов.
 * ___________________________________________________________________________
 * Команду и Снимок можно использовать сообща для реализации отмены операций. В этом случае объекты команд будут отвечать за выполнение
 * действия над объектом, а снимки будут хранить резервную копию состояния этого объекта, сделанную перед самым запуском команды.
 *
 * ___________________________________________________________________________
 * Применимость
 * - Когда вам нужна операция отмены.
 * - Когда вы хотите ставить операции в очередь, выполнять их по расписанию или передавать по сети.
 * - Когда вы хотите параметризовать объекты выполняемым действием.
 */

import { AfterViewInit, HostListener, Injectable, ViewChild } from '@angular/core';

interface ICommand {
  execute();
}

abstract class Command implements ICommand {
  constructor(protected editor: IEditor, protected editorHolder: IEditorHolder, protected commandHistoryService: CommandHistoryService) {}

  abstract execute();

  saveBackup() {
    const editorMemento = new EditorMemento(this.editor.getText());
    this.commandHistoryService.backup(editorMemento);
  }

  undo() {
    const editorMemento: IEditorMemento = this.commandHistoryService.undo();
    if (editorMemento) {
      this.editor.setText(editorMemento.getText());
    }
  }
}

class CopyCommand extends Command {
  execute() {
    this.editorHolder.clipboard = this.editor.getSelection();
  }
}

class CutCommand extends Command {
  execute() {
    this.saveBackup();
    this.editorHolder.clipboard = this.editor.getSelection();
    this.editor.deleteSelection();
  }
}

class PasteCommand extends Command {
  execute() {
    this.saveBackup();
    this.editor.replaceSelection(this.editorHolder.clipboard);
  }
}

class UndoCommand extends Command {
  execute() {
    this.undo();
  }
}

// ========================= паттерн Снимок. Начало

@Injectable()
class CommandHistoryService {
  private editorMemento: IEditorMemento[] = [];

  public backup(editorMemento: IEditorMemento): void {
    this.editorMemento.push(editorMemento);
  }

  public undo(): IEditorMemento {
    if (!this.editorMemento.length) {
      return;
    }
    return this.editorMemento.pop();
  }

  public getChangesHistory(): IEditorMemento[] {
    return this.editorMemento;
  }
}

interface IEditorMemento {
  getText(): string;

  getMementoDate(): any;
}

class EditorMemento implements IEditorMemento {
  private readonly text: string;
  private readonly date: Date;

  constructor(text: string) {
    this.text = text;
    this.date = new Date();
  }

  getText(): string {
    return this.text;
  }

  getMementoDate(): Date {
    return this.date;
  }
}

// ========================= паттерн Снимок. Конец

interface IEditor {
  getText(): string;

  setText(text): void;

  getSelection(): string;

  deleteSelection(): void;

  replaceSelection(text): void;
}

class EditorComponent implements IEditor {
  private text: string;

  public getText(): string {
    return this.text;
  }

  public setText(text) {
    this.text = text;
  }

  public getSelection(): string {
    return 'selectedText';
  }

  public deleteSelection(): void {
    //  deleteSelection
  }

  public replaceSelection(text): void {
    //  replaceSelection
  }
}

interface IEditorHolder {
  clipboard: string;
}

class EditorHolderComponent implements IEditorHolder, AfterViewInit {
  @ViewChild(EditorComponent) editorComponent: EditorComponent;

  public clipboard;

  private editorHolderService: EditorHolderService;

  constructor(private commandHistoryService: CommandHistoryService) {}

  ngAfterViewInit() {
    this.editorHolderService = new EditorHolderService(this.editorComponent, this, this.commandHistoryService);
  }

  @HostListener('window:keydown.control.x', ['$event'])
  cutShortcut(event?: KeyboardEvent) {
    event?.preventDefault();
    this.editorHolderService.cutCommand.execute();
  }

  @HostListener('window:keydown.control.c', ['$event'])
  copyShortcut(event?: KeyboardEvent) {
    event?.preventDefault();
    this.editorHolderService.copyCommand.execute();
  }

  @HostListener('window:keydown.control.v', ['$event'])
  pasteShortcut(event?: KeyboardEvent) {
    event?.preventDefault();
    this.editorHolderService.pasteCommand.execute();
  }

  @HostListener('window:keydown.control.z', ['$event'])
  undoShortcut(event?: KeyboardEvent) {
    event?.preventDefault();
    this.editorHolderService.undoCommand.execute();
  }

  public getChangesHistory(): IEditorMemento[] {
    return this.commandHistoryService.getChangesHistory();
  }
}

@Injectable()
class EditorHolderService {
  public copyCommand: ICommand = new CopyCommand(this.editor, this.editorHolder, this.commandHistoryService);
  public cutCommand: ICommand = new CutCommand(this.editor, this.editorHolder, this.commandHistoryService);
  public pasteCommand: ICommand = new PasteCommand(this.editor, this.editorHolder, this.commandHistoryService);
  public undoCommand: ICommand = new UndoCommand(this.editor, this.editorHolder, this.commandHistoryService);

  constructor(private editor: IEditor, private editorHolder: IEditorHolder, private commandHistoryService: CommandHistoryService) {}
}
