import { select, selectAll } from 'd3'

const buttons = selectAll("button").nodes()

buttons[0].addEventListener('click', () => change('cat.jpeg'));
buttons[1].addEventListener('click', () => change('image.jpeg'));
buttons[2].addEventListener('click', changeColor);


function change(imageName) {
    select('#animalImg').attr('src', imageName);
}

function changeColor() {
    const color = select('#text').style('color');
    if (color === 'red') {
        select('#text').style('color', 'blue')
    } else {
        select('#text').style('color', 'red')
    }
}
