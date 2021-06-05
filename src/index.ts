let canvas: HTMLCanvasElement;
let ctx: any;
let FPS = 50;
let columnas = 20;
let filas = 20;
let escenario: Casilla[][];
let anchoT: number;
let altoT: number;
const muro = "#000000";
const tierra = "#777777";
let principio: Casilla;
let fin: Casilla;
let openSet: Casilla[] = [];
let closedSet: Casilla[] = [];
let camino: Casilla[] = [];
let terminado = false;
console.time("tiempo");
function creaArray2D(f: number, c: number) {
  let obj = new Array(f);
  for (let a = 0; a < f; a++) {
    obj[a] = new Array(c);
  }
  return obj;
}
function heuristica(a: Casilla, b: Casilla) {
  return Math.abs(a.x - b.x)+ Math.abs(a.y - b.y);
}
function borraDelArray(array: Casilla[], elemento: Casilla) {
  for (let i = array.length - 1; i >= 0; i--) {
    if (array[i] == elemento) {
      array.splice(i, 1);
    }
  }
}
class Casilla {
  public x: number;
  public y: number;
  public tipo: number;
  public f: number;
  public h: number;
  public vecinos: any[];
  public padre: null;
  public g: number;
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.tipo = 0;
    let aleatorio = Math.floor(Math.random() * 4); // 0-4
    if (aleatorio == 1) this.tipo = 1;
    this.f = 0;
    this.g = 0;
    this.h = 0;
    this.vecinos = [];
    this.padre = null;
  }
  addVecinos() {
    if (this.x > 0) this.vecinos.push(escenario[this.y][this.x - 1]);
    if (this.x < filas - 1) this.vecinos.push(escenario[this.y][this.x + 1]);
    if (this.y > 0) this.vecinos.push(escenario[this.y - 1][this.x]);
    if (this.y < columnas - 1) this.vecinos.push(escenario[this.y + 1][this.x]);
  }
  dibuja() {
    let color;
    if (this.tipo == 0) color = tierra;
    if (this.tipo == 1) color = muro;
    ctx.fillStyle = color;
    ctx.fillRect(this.x * anchoT, this.y * altoT, anchoT, altoT);
  }
  dibujaOS() {
    ctx.fillStyle = "#008000";
    ctx.fillRect(this.x * anchoT, this.y * altoT, anchoT, altoT);
  }
  dibujaCS() {
    ctx.fillStyle = "#800000";
    ctx.fillRect(this.x * anchoT, this.y * altoT, anchoT, altoT);
  }
  dibujaCamino() {
    ctx.fillStyle = "#00FFFF"; //cyan
    ctx.fillRect(this.x * anchoT, this.y * altoT, anchoT, altoT);
  }
}
function inicializa() {
  canvas = <HTMLCanvasElement>document.getElementById("canvas");
  ctx = canvas.getContext("2d");
  anchoT = parseInt(String(canvas.width / columnas));
  altoT = parseInt(String(canvas.height / filas));
  escenario = creaArray2D(filas, columnas);
  for (let i = 0; i < filas; i++) {
    for (let j = 0; j < columnas; j++) {
      escenario[i][j] = new Casilla(j, i);
    }
  }
  for (let i = 0; i < filas; i++) {
    for (let j = 0; j < columnas; j++) {
      escenario[i][j].addVecinos();
    }
  }
  principio = escenario[0][0];
  fin = escenario[columnas - 1][filas - 1];
  openSet.push(principio);
  setInterval(function () {
    principal();
  }, 1);
}
function dibujaEscenario() {
  for (let i = 0; i < filas; i++) {
    for (let j = 0; j < columnas; j++) {
      escenario[i][j].dibuja();
    }
  }
  for (let i = 0; i < openSet.length; i++) {
    openSet[i].dibujaOS();
  }
  for (let i = 0; i < closedSet.length; i++) {
    closedSet[i].dibujaCS();
  }
  for (let i = 0; i < camino.length; i++) {
    camino[i].dibujaCamino();
  }
}
function borraCanvas() {
  canvas.width = canvas.width;
  canvas.height = canvas.height;
}
function algoritmo() {
  if (terminado != true) {
    if (openSet.length > 0) {
      let ganador = 0;
      for (let i = 0; i < openSet.length; i++) {
        if (openSet[i].f < openSet[ganador].f) {
          ganador = i;
        }
      }
      let actual = openSet[ganador];
      if (actual === fin) {
        let temporal = actual;
        camino.push(temporal);
        while (temporal.padre != null) {
          temporal = temporal.padre;
          camino.push(temporal);
        }
        console.timeEnd("tiempo")
        console.log("camino encontrado");
        terminado = true;
      }
      else {
        borraDelArray(openSet, actual);
        closedSet.push(actual);
        let vecinos = actual.vecinos;
        for (let i = 0; i < vecinos.length; i++) {
          let vecino = vecinos[i];
          if (!closedSet.includes(vecino) && vecino.tipo != 1) {
            let tempG = actual.g + 1;
            if (openSet.includes(vecino) && tempG < vecino.g) {
                vecino.g = tempG;
            } else {
              vecino.g = tempG;
              openSet.push(vecino);
            }
            vecino.h = heuristica(vecino, fin);
            vecino.f = vecino.g + vecino.h;
            vecino.padre = actual;
          }
        }
      }
    } else {
      console.log("No hay un camino posible");
      terminado = true;
    }
  }
}
function principal() {
  borraCanvas();
  algoritmo();
  dibujaEscenario();
}
inicializa();
