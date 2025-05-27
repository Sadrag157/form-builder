export class Option {
    constructor(optionData = {}, index = 0) {
        this.id = optionData.id || Date.now() + index + Math.random();
        this.text = optionData.text || ``;
        this.value = optionData.value || `value_${this.id}`;
        this.isCorrect = optionData.isCorrect || false;
    }
}