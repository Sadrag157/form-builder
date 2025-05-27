import { Option } from './option.js';

export class FieldData {
    constructor(type, { options = [] } = {}) {
        this.id = Date.now();
        this.type = type;
        this.options = options.map((opt, index) => new Option(opt, index));
        this._ensureInitialCorrectOption();
    }

    addOption(data = {}) {
        const newOption = new Option(data, this.options.length);
        this.options.push(newOption);
        return newOption;
    }

    removeOption(optionId) {
        this.options = this.options.filter(opt => opt.id !== optionId);
    }

    updateCorrectOption(optionId) {
        this.options.forEach(opt => opt.isCorrect = opt.id == optionId);
    }

    getOptionById(id) {
        return this.options.find(opt => opt.id == id);
    }

    _ensureInitialCorrectOption() {
        if (!this.options.some(opt => opt.isCorrect) && this.options.length > 0) {
            this.options[0].isCorrect = true;
        }
    }
}
