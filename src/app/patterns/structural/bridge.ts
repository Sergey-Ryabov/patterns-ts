/**
 * Bridge - это структурный паттерн, который разделяет бизнес-логику или большой класс на несколько отдельных иерархий,
 * которые потом можно развивать отдельно друг от друга.
 * Одна из этих иерархий (абстракция) получит ссылку на объекты другой иерархии (реализация) и будет делегировать им основную работу.
 * Благодаря тому, что все реализации будут следовать общему интерфейсу, их можно будет взаимозаменять внутри абстракции.
 * ___________________________________________________________________________
 * - Мост проектируют загодя, чтобы развивать большие части приложения отдельно друг от друга. Адаптер применяется постфактум,
 * чтобы заставить несовместимые классы работать вместе.
 * - Абстрактная фабрика может работать совместно с Мостом. Это особенно полезно, если у вас есть абстракции, которые могут работать только
 * с некоторыми из реализаций. В этом случае фабрика будет определять типы создаваемых абстракций и реализаций.
 * - Паттерн Строитель может быть построен в виде Моста: директор будет играть роль абстракции, а строители — реализации.
 * ___________________________________________________________________________
 * Применимость
 * - Когда вы хотите разделить монолитный класс, который содержит несколько различных реализаций какой-то функциональности
 * (например, если класс может работать с разными API систем: баз данных, REST, graphQl).
 * - Когда класс нужно расширять в двух независимых плоскостях.
 * - Когда вы хотите, чтобы реализацию можно было бы изменять во время выполнения программы.
 */

// см. реальный пример в bridge_Angular_Form.png

/**
 * Абстракция устанавливает интерфейс для «управляющей» части двух иерархий
 * классов. Она содержит ссылку на объект из иерархии Реализации и делегирует
 * ему всю настоящую работу.
 */
class Abstraction {
  protected implementation: Implementation;

  constructor(implementation: Implementation) {
    this.implementation = implementation;
  }

  public operation(): string {
    const result = this.implementation.operationImplementation();
    return `Abstraction: Base operation with:\n${result}`;
  }
}

/**
 * Можно расширить Абстракцию без изменения классов Реализации.
 */
class ExtendedAbstraction extends Abstraction {
  public operation(): string {
    const result = this.implementation.operationImplementation();
    return `ExtendedAbstraction: Extended operation with:\n${result}`;
  }
}

/**
 * Реализация устанавливает интерфейс для всех классов реализации. Он не должен
 * соответствовать интерфейсу Абстракции. На практике оба интерфейса могут быть
 * совершенно разными. Как правило, интерфейс Реализации предоставляет только
 * примитивные операции, в то время как Абстракция определяет операции более
 * высокого уровня, основанные на этих примитивах.
 */
interface Implementation {
  operationImplementation(): string;
}

/**
 * Каждая Конкретная Реализация соответствует определённой платформе и реализует
 * интерфейс Реализации с использованием API этой платформы.
 */
class ConcreteImplementationA implements Implementation {
  public operationImplementation(): string {
    return 'ConcreteImplementationA: Here\'s the result on the platform A.';
  }
}

class ConcreteImplementationB implements Implementation {
  public operationImplementation(): string {
    return 'ConcreteImplementationB: Here\'s the result on the platform B.';
  }
}
