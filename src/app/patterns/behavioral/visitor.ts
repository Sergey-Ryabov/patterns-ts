/**
 * Visitor (Посетитель) — это поведенческий паттерн проектирования, который позволяет добавлять в программу новые операции, не изменяя
 * классы объектов, над которыми эти операции могут выполняться.
 *
 * Преимущества
 * - Упрощает добавление операций, работающих со сложными структурами объектов.
 * - Объединяет родственные операции в одном классе.
 * - Посетитель может накапливать состояние при обходе структуры элементов.
 *
 * Недостатки:
 * - Паттерн не оправдан, если иерархия элементов часто меняется.
 * - Может привести к нарушению инкапсуляции элементов.
 * ___________________________________________________________________________
 * Посетитель можно рассматривать как расширенный аналог Команды, который способен работать сразу с несколькими видами получателей.
 *
 * Можно выполнить какое-то действие над всем деревом Компоновщика при помощи Посетителя.
 *
 * Посетитель можно использовать совместно с Итератором. Итератор будет отвечать за обход структуры данных,
 * а Посетитель — за выполнение действий над каждым её компонентом.
 *
 * ___________________________________________________________________________
 * Применимость
 * - Когда нужно выполнить какую-то операцию над всеми элементами сложной структуры объектов, например, деревом.
 * - Когда новое поведение имеет смысл только для некоторых классов из существующей иерархии.
 * - Когда над объектами сложной структуры объектов надо выполнять некоторые не связанные между собой операции, но
 * вы не хотите «засорять» классы такими операциями.
 */

interface IVisitor {
  visitMeasureObject(mo: IMeasureObject);

  visitMeasurePoint(mo: IMeasurePoint);
}

class XMLExportVisitor implements IVisitor {
  visitMeasureObject(mo: IMeasureObject) {
    return 'MeasureObject in XML';
  }

  visitMeasurePoint(mo: IMeasurePoint) {
    return 'MeasurePoint in XML';
  }
}

class JSONExportVisitor implements IVisitor {
  visitMeasureObject(mo: IMeasureObject) {
    return 'MeasureObject in JSON';
  }

  visitMeasurePoint(mo: IMeasurePoint) {
    return 'MeasurePoint in JSON';
  }
}

interface IEquipment {
  accept(v: IVisitor);
}

// Measure Object

interface IMeasureObject {
  measureObjectFields: any;
}

class MeasureObject implements IEquipment, IMeasureObject {
  measureObjectFields: any;

  public accept(v: IVisitor) {
    v.visitMeasureObject(this);
  }
}

// Measure Point

interface IMeasurePoint {
  measurePointFields: any;
}

class MeasurePoint implements IEquipment, IMeasurePoint {
  measurePointFields: any;

  public accept(v: IVisitor) {
    v.visitMeasurePoint(this);
  }
}

class TreeEquipmentComponent {
  private equipments: IEquipment[] = [];

  public export(isXml = true) {
    const visitor = isXml ? new XMLExportVisitor() : new JSONExportVisitor();

    const equipmentsInXml = [];
    this.equipments.forEach((e) => {
      const equipmentInXml = e.accept(visitor);
      equipmentsInXml.push(equipmentInXml);
    });

    // дальнейшая обработка equipmentsInXml
  }
}
