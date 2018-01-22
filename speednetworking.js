TABLE_FONT = {
  family: 'Courier'
};

moveText = function (text, x, y, duration = 1) {
    let offset = text.attr('y') - text.y();

    return text.animate(duration).attr({
      x,
      y: y + offset
    });
  }

class Person {
  constructor(svgDoc, label, table, cellX, cellY) {
    this.svgDoc = svgDoc;
    this.label = label;
    this.table = table;
    this.cellX = cellX;
    this.cellY = cellY;
    this.x = table.x + cellX * table.cellSize;
    this.y = table.y + cellY * table.cellSize * 1.2;

    TABLE_FONT.size = table.cellSize * (22.0/25.0);

    this.element = svgDoc.text(this.label).font(TABLE_FONT).move(this.x, this.y);

    if (this.cellX == table.pivotX && this.cellY == table.pivotY) {
      this.isPivot = true;
      this.element.fill('red');
    } else {
      this.isPivot = false;
    }
  }

  move () {
    if (this.isPivot) 
      return;

    let newCell = this.getMove(this.cellX, this.cellY);
    this.cellX = newCell.x;
    this.cellY = newCell.y;

    this.x = this.table.x + this.cellX * this.table.cellSize;
    this.y = this.table.y + this.cellY * this.table.cellSize * 1.2;

    moveText(this.element, this.x, this.y, 1000);
  }

  getMove (cellX, cellY) {
    let newX = cellX;
    let newY = cellY;

    if (cellY == 0) {
      // On top row.
      if (cellX < this.table.rowLength - 1) {
        // Not in the last position.
        newX++;
      } else {
        // In the last position.
        newY = 1;
      }
    } else {
      // On bottom row
      if (cellX > 0) {
        // Not in the last position
        newX--;
      } else {
        // In the last position
        newY = 0;
      }
    }

    // If the new position that I'm moving to is the pivot position, skip it.
    if (newX == this.table.pivotX && newY == this.table.pivotY) {
      return this.getMove(newX, newY);
    }

    return { x: newX, y: newY };
  }
}

class Table {
  constructor(svgDoc, x, y, rowLength, cellSize) {
    if (rowLength > 13) {
      throw new Error('Cannot have a rowLength > 13.');
    }

    this.x = x;
    this.y = y;
    this.rowLength = rowLength;
    this.cellSize = cellSize;

    this.pivotX = 0;
    this.pivotY = 0;

    this.people = [];

    for (let i = 0; i < rowLength; i++) {
      let label1 = String.fromCharCode(65 + i);
      let label2 = String.fromCharCode(65 + i + rowLength);

      this.people.push(new Person(svgDoc, label1, this,i,0));
      this.people.push(new Person(svgDoc, label2, this,i,1));
    }
  }

  executeRotation () {
    this.people.forEach((person) => person.move());
  }
}
