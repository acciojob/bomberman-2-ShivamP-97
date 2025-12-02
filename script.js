
function reset() {
    for (let i = 1; i <= 9; i++) {
        const block = document.getElementById(`${i}`);
        block.style.backgroundColor = "transparent";
    }
}

document.getElementById('reset_button').addEventListener('click', reset);

document.getElementById('change_button').addEventListener('click', () => {
    reset();

    const blockId = document.getElementById("block_id").value;
    const color = document.getElementById("colour_id").value;

    const block = document.getElementById(blockId);

    if (!block) {
        alert("Invalid block ID! Enter a number 1–9.");
        return;
    }

    block.style.backgroundColor = color;
});
