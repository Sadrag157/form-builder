export class FormStreamProcessor {
    static async *processFormZones(formArea) {
        const zones = formArea.querySelectorAll('.drop-zone');
        
        for (const zone of zones) {
            await new Promise(resolve => setTimeout(resolve, 0));
            
            const zoneData = {
                id: zone.dataset.id,
                question: zone.querySelector('.question-title')?.value,
                fields: []
            };

            const fields = zone.querySelectorAll('.field');
            for (const field of fields) {
                if (field.dataset.fieldType === 'radio') {
                    const options = [];
                    const optionItems = field.querySelectorAll('.option-item');
                    
                    for (const item of optionItems) {
                        options.push({
                            id: item.dataset.optionId,
                            text: item.querySelector('.option-text-input')?.value,
                            isCorrect: item.querySelector('input[type="radio"]')?.checked
                        });
                    }

                    zoneData.fields.push({
                        type: 'radio',
                        options
                    });
                }
            }

            yield zoneData;
        }
    }

    static async saveFormInChunks(formArea) {
        const chunks = [];
        let currentChunk = [];
        const CHUNK_SIZE = 10;

        for await (const zone of this.processFormZones(formArea)) {
            currentChunk.push(zone);

            if (currentChunk.length >= CHUNK_SIZE) {
                chunks.push([...currentChunk]);
                currentChunk = [];
                await new Promise(resolve => setTimeout(resolve, 0));
            }
        }

        if (currentChunk.length > 0) {
            chunks.push(currentChunk);
        }

        return chunks;
    }
}