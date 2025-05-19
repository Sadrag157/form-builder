document.addEventListener('DOMContentLoaded', ()=>{
    console.log("Response page DOM loaded and parsed");

    const responseFormArea=document.getElementById('responseFormArea');
    const formTitleElement=document.querySelector('.response-form-title');
    const submitButton=document.getElementById('submitResponseButton');

    if(!responseFormArea || !formTitleElement || !submitButton){
        console.log("Required elements not found on response page!");
        return;
    }

    const savedFormDataString=localStorage.getItem('savedFormData');

    if(!savedFormDataString){
        responseFormArea.innerHTML='<p>No form data found. Please build and save a form first</p>';
        formTitleElement.textContent='Form not found';
        submitButton.style.display='none';
        return;
    }

    let correctAnswers={};

    try{
        const formStructure=JSON.parse(savedFormDataString);
        console.log('Loaded form structure:', formStructure);

        formTitleElement.textContent=formStructure.title || 'Untitled Form';
        responseFormArea.innerHTML='';

        if(formStructure.zones&&formStructure.zones.length >0){
            formStructure.zones.forEach((zone, zoneIndex)=>{
                const zoneElement=document.createElement('div');
                zoneElement.className='response-zone';

                const questionElement=document.createElement('h3');
                questionElement.textContent= zone.question || `Question ${zoneIndex + 1}`;
                questionElement.className='response-question-title';
                zoneElement.appendChild(questionElement);

                if(zone.fields&&zone.fields.length>0){
                    zone.fields.forEach((field, fieldIndex) =>{
                        const fieldContainer=document.createElement('div');
                        fieldContainer.className = 'response-field';

                        if (field.type==='radio'&&field.options&&field.options.length>0){
                            const optionsContainer=document.createElement('div');
                            optionsContainer.className='response-options-container';

                            const radioGroupName=`question_${zoneIndex}_field_${field.id || fieldIndex}_radio`;

                            const correctAnswerOption = field.options.find(opt => opt.isCorrect);
                            if(correctAnswerOption){
                                correctAnswers[radioGroupName] = String(correctAnswerOption.id)
                            }else{
                                console.warn(`No correct answer defined for radio group: ${radioGroupName}`);
                            }
                            field.options.forEach((option, optionIndex)=>{
                                const optionElement = document.createElement('div');
                                optionElement.className = 'response-options-item';
                                optionElement.dataset.optionId = option.id;
    
                                const radioInput=document.createElement('input');
                                radioInput.type='radio';
                                radioInput.name=radioGroupName;
                                radioInput.value = option.id || `opt${optionIndex}`;
                                radioInput.id=`${radioGroupName}_opt${option.id || optionIndex}`;
                                radioInput.className='rasponse-radio-input';

                                const labelElement = document.createElement('label');
                                labelElement.htmlFor = radioInput.id;
                                labelElement.textContent=option.text;

                                optionElement.appendChild(radioInput);
                                optionElement.appendChild(labelElement);
                                optionsContainer.appendChild(optionElement);
                            });
                            fieldContainer.appendChild(optionsContainer);

                        }
                        if(fieldContainer.hasChildNodes()){
                            zoneElement.appendChild(fieldContainer);
                        }
                    });
                }
                responseFormArea.appendChild(zoneElement);
            });
        }else{
            responseFormArea.innerHTML='<p>This form has no question.</p>';
        }

        submitButton.addEventListener('click', (e)=>{
            e.preventDefault()
            const formData={};
            const formElements = responseFormArea.querySelectorAll('input, select, textarea');

            formElements.forEach(element=>{
                if(element.type === 'radio' && element.checked){
                    formData[element.name] = element.value;
                }
            })

            const allOptionElements = responseFormArea.querySelectorAll('.response-options-item');

            allOptionElements.forEach(optionElement =>{
                optionElement.classList.remove('correct-answer', 'incorrect-answer');

                const radioInput=optionElement.querySelector('input[type="radio"]');
                if(!radioInput) return;

                const optionId = optionElement.dataset.optionId;
                const radioGroupName = radioInput.name;
                const correctAnswerId = correctAnswers[radioGroupName];

                if (radioInput.checked) {
                    if (optionId === correctAnswerId) {
                        optionElement.classList.add('correct-answer');
                    } else {
                        optionElement.classList.add('incorrect-answer');
                    }
                }
                else if (optionId === correctAnswerId) {
                    optionElement.classList.add('correct-answer');
                }
                radioInput.disabled = true
            });
            submitButton.disabled = true;
            submitButton.textContent = 'Submitted';
        })
    }catch(e){
        console.error('Error parsing saved form data:', e);
        responseFormArea.innerHTML='<p>Error loading form data.</p>';
        formTitleElement.textContent='Error';
        submitButton.style.display='none';
    }
});