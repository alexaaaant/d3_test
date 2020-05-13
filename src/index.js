import { select, selectAll } from 'd3'

const header = select('#page-header');
const ps = selectAll('p');
console.log(header.node())
console.log(ps.nodes())

const buttons = selectAll("button").nodes()

buttons[0].addEventListener('click', change1);
buttons[1].addEventListener('click', change2);
buttons[2].addEventListener('click', change3);
buttons[3].addEventListener('click', change4);

function change1() {
    const p = select(".main-paragraph");
    p.text('new text');
}

function change2() {
    const ps = selectAll('p')
    ps.text('new text 2')
}

function change3() {
    select('p').html('<b>test</b> test')
}

function change4() {
    select('p').text('<b>test</b> test')
}