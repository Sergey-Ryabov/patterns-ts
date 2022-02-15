/**
 * Factory method — это порождающий паттерн, который определяет общий интерфейс для создания объектов в суперклассе,
 * позволяя подклассам изменять тип создаваемых объектов.
 * ___________________________________________________________________________
 * Фабричный метод задаёт метод, который следует использовать вместо вызова оператора new для создания объектов-продуктов.
 * Подклассы могут переопределить этот метод, чтобы изменять тип создаваемых продуктов.
 * ___________________________________________________________________________
 * Применимость
 * - Когда заранее неизвестны типы и зависимости объектов, с которыми должен работать ваш код.
 * - Когда вы хотите дать возможность пользователям расширять части вашего фреймворка или библиотеки.
 */

enum ToolName {
  SQUARE = 'SQUARE',
  RECTANGLE = 'RECTANGLE',
  CIRCLE = 'CIRCLE',
}

interface Tool {
  draw();

  resize();
}

class Square implements Tool {
  draw() {
    console.info('draw Square');
  }

  resize() {
    console.info('resize Square');
  }
}

class Rectangle implements Tool {
  draw() {
    console.info('draw Rectangle');
  }

  resize() {
    console.info('resize Rectangle');
  }
}

class Circle implements Tool {
  draw() {
    console.info('draw Circle');
  }

  resize() {
    console.info('resize Circle');
  }
}

abstract class ToolCreator {
  public abstract getToolName(): ToolName;

  public abstract createTool(): Tool;

  //   another methods
}

class SquareToolCreator extends ToolCreator {
  getToolName(): ToolName {
    return ToolName.SQUARE;
  }

  createTool(): Tool {
    return new Square();
  }
}

class RectangleToolCreator extends ToolCreator {
  getToolName(): ToolName {
    return ToolName.RECTANGLE;
  }

  createTool(): Tool {
    return new Rectangle();
  }
}

class CircleToolCreator extends ToolCreator {
  getToolName(): ToolName {
    return ToolName.CIRCLE;
  }

  createTool(): Tool {
    return new Circle();
  }
}

class ToolBar {
  private toolCreators: ToolCreator[] = [new SquareToolCreator(), new RectangleToolCreator(), new CircleToolCreator()];
  private currentToolCreator: ToolCreator;

  public addToolCreator(toolCreator: ToolCreator) {
    this.toolCreators.push(toolCreator);
  }

  public select(toolName: ToolName) {
    this.currentToolCreator = this.toolCreators.find((toolCreator) => toolName === toolCreator.getToolName());
  }

  public getToolForDraw() {
    if (!this.currentToolCreator) {
      console.error('select Tool please');
    }
    return this.currentToolCreator.createTool();
  }
}
