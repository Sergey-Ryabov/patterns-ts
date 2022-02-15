/**
 * Composite (Дерево)  — это структурный паттерн проектирования, который позволяет сгруппировать множество объектов в древовидную структуру,
 * а затем работать с ней так, как будто это единичный объект.
 * Паттерн применим, если из объектов строится древовидная структура, и со всеми объектами дерева,
 * как и с самим деревом работают через общий интерфейс.
 *
 * Все операции компоновщика основаны на рекурсии и «суммировании» результатов на ветвях дерева.
 *
 * Упрощает архитектуру клиента при работе со сложным деревом компонентов.
 * Облегчает добавление новых видов компонентов.
 * ___________________________________________________________________________
 * Компоновщик и Декоратор имеют похожие структуры классов из-за того, что оба построены на рекурсивной вложенности.
 * Она позволяет связать в одну структуру бесконечное количество объектов.
 * Декоратор оборачивает только один объект, а узел Компоновщика может иметь много детей.
 * Декоратор добавляет вложенному объекту новую функциональность, а Компоновщик не добавляет ничего нового,
 * но «суммирует» результаты всех своих детей.
 * Но они могут и сотрудничать: Компоновщик может использовать Декоратор, чтобы переопределить функции отдельных частей дерева компонентов.
 *
 * Компоновщик часто совмещают с Легковесом, чтобы реализовать общие ветки дерева и сэкономить при этом память.
 * ___________________________________________________________________________
 * Применимость
 * - Когда вам нужно представить древовидную структуру объектов.
 * - Когда клиенты должны единообразно трактовать простые и составные объекты.
 */

interface IDocument {
  sign();

  isReadyToSend(): boolean;
}

class DocumentLeaf implements IDocument {
  constructor(private docInfo: IDocumentInfo, private signService: SignService) {}

  sign() {
    if (this.signService.canSign()) {
      console.info('sign docInfo = ', this.docInfo);
    }
  }

  public isReadyToSend(): boolean {
    return this.docInfo.state === DocumentState.SIGNED;
  }
}

class DocumentComposite implements IDocument {
  private children: IDocument[] = [];

  constructor(private signService: SignService, children?: IDocumentInfo[]) {
    children?.forEach((docInfo) => {
      this.children.push(new DocumentLeaf(docInfo, signService));
    });
  }

  add(d: IDocument) {
    this.children.push(d);
  }

  sign() {
    this.children.forEach((doc) => doc.sign());
  }

  public isReadyToSend(): boolean {
    const hasIsNotReadyDocument = this.children.find((doc) => doc.isReadyToSend() === false);
    return hasIsNotReadyDocument ? false : true;
  }
}

class TreeComponent {
  private docTree: DocumentComposite;
  private signService = new SignService();

  constructor() {
    this.docTree = new DocumentComposite(this.signService, [
      {
        id: 1,
        name: 'first.doc',
        signType: DocumentSignType.SINGLE,
        state: DocumentState.DRAFT,
      },
      {
        id: 2,
        name: 'second.doc',
        signType: DocumentSignType.MULTI,
        state: DocumentState.DRAFT,
      },
    ]);
  }

  public add() {
    this.docTree.add(
      new DocumentComposite(this.signService, [
        {
          id: 3,
          name: 'third.doc',
          signType: DocumentSignType.MULTI,
          state: DocumentState.DRAFT,
        },
      ])
    );
  }

  public signAll() {
    this.docTree.sign();
  }

  public isReadyToSend(): boolean {
    return this.docTree.isReadyToSend();
  }
}

interface IDocumentInfo {
  id: number;
  name: string;
  signType: DocumentSignType;
  state: DocumentState;
}

enum DocumentSignType {
  SINGLE = 'SINGLE',
  MULTI = 'MULTI',
}

enum DocumentState {
  DRAFT = 'DRAFT',
  IN_PROCESS = 'IN_PROCESS',
  SIGNED = 'SIGNED',
}

class SignService {
  public canSign(): boolean {
    return true;
  }
}
