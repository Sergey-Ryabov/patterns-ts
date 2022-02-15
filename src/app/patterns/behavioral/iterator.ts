/**
 * Iterator (Итератор) — это поведенческий паттерн, позволяющий последовательно обходить сложную коллекцию,
 * без раскрытия деталей её реализации
 *
 * Преимущества
 * - Упрощает классы хранения данных.
 * - Позволяет реализовать различные способы обхода структуры данных.
 * - Позволяет одновременно перемещаться по структуре данных в разные стороны.
 *
 * ___________________________________________________________________________
 * Применимость
 * - Когда у вас есть сложная структура данных, и вы хотите скрыть от клиента детали её реализации
 * (из-за сложности или вопросов безопасности).
 * - Когда вам нужно иметь несколько вариантов обхода одной и той же структуры данных.
 * - Когда вам хочется иметь единый интерфейс обхода различных структур данных.
 */

interface IIterator<T> {
  hasNext(): boolean;

  next(): T;
}

interface IIterable<T> {
  getIterator(config?: any): IIterator<T>;
}

class Tree implements ITree, IIterable<ITreeItem> {
  private treeItems: ITreeItem[] = [
    {
      id: 1,
      hasChildren: true,
      data: 'any data 1',
    },
    {
      id: 2,
      hasChildren: true,
      data: 'any data 2',
    },
    {
      id: 3,
      hasChildren: false,
      data: 'any data 3',
    },
    {
      id: 11,
      parentId: 1,
      hasChildren: false,
      data: 'any data 11',
    },
    {
      id: 22,
      parentId: 2,
      hasChildren: true,
      data: 'any data 22',
    },
    {
      id: 222,
      parentId: 22,
      hasChildren: false,
      data: 'any data 222',
    },
  ];

  getTreeItems(): ITreeItem[] {
    return this.treeItems;
  }

  getIterator(config?): IIterator<ITreeItem> {
    return new TreeIterator(this, config?.isDepthFirst);
  }
}

class TreeIterator implements IIterator<ITreeItem> {
  private isDepthFirst = false; // по умолчанию breadth first
  private tree: ITree;
  // поля для навигации по коллекции
  private cursor;

  constructor(tree: ITree, isDepthFirst?: boolean) {
    this.tree = tree;
    this.isDepthFirst = isDepthFirst ?? false;
  }

  hasNext(): boolean {
    // анализируем this.cursor
    return this.isDepthFirst ? this.hasNextInDepth() : this.hasNextInBreadth();
  }

  next(): ITreeItem {
    // обновляем this.cursor и возвращаем следующий элемент
    return this.isDepthFirst ? this.nextInDepth() : this.nextInBreadth();
  }

  private hasNextInDepth(): boolean {
    return true;
  }

  private hasNextInBreadth(): boolean {
    return false;
  }

  private nextInDepth(): ITreeItem {
    return this.tree.getTreeItems()[0];
  }

  private nextInBreadth(): ITreeItem {
    return this.tree.getTreeItems()[0];
  }
}

function client() {
  const tree = new Tree();

  const depthFirstIterator = tree.getIterator({
    isDepthFirst: true,
  });
  const breadthFirstIterator = tree.getIterator();

  // 1 11 2 22 222 3
  while (depthFirstIterator.hasNext()) {
    const depthFirstItem = depthFirstIterator.next();
    // tslint:disable-next-line:no-console
    console.info('depthFirstItem = ', depthFirstItem);
  }

  // 1 2 3 11 22 222
  while (breadthFirstIterator.hasNext()) {
    const breadthFirstItem = breadthFirstIterator.next();
    // tslint:disable-next-line:no-console
    console.info('breadthFirstItem = ', breadthFirstItem);
  }
}

interface ITreeItem {
  id: number;
  hasChildren: boolean;
  data: any;
  parentId?: number;
}

interface ITree {
  getTreeItems(): ITreeItem[];
}
