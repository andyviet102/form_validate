//ham valudaor
function Validator(options) {

    var selectorRules = {}
     

    //ham thuc hien validate
    function Validate(inputElement,rule){
        var errorElement = inputElement.parentElement.querySelector(options.errorSelector);
        var errorMessage;


        //lay ra cac rule cua selector 
        var rules = selectorRules[rule.selector];

        //lap qua tung rule
        //neu co loi thi dung viec kiem tra 
        for (var i = 0; i < rules.length; i++){
           errorMessage  =  rules[i](inputElement.value);
           if(errorMessage) break;
        }
        
        if(errorMessage){
        errorElement.innerText = errorMessage;
        inputElement.parentElement.classList.add('invalid');
        } else {
        errorElement.innerText ='';
        inputElement.parentElement.classList.remove('invalid');
        }
        return !errorMessage;
    }

    //lay elements cua form can validate
    var formElement = document.querySelector(options.form);

    if(formElement){

        formElement.onsubmit = function(e){
            e.preventDefault();

            var isFormValid = true;

            //thuc hien lap qua tung rule va validate
            options.rules.forEach(function(rule){
            var inputElement = formElement.querySelector(rule.selector);
            var isValid =  Validate(inputElement,rule);
            if(!isValid){
                isFormValid = false;
            }
            });


            if(isFormValid){
                //truông hop submit vs js
                if(typeof options.onSubmit === 'function'){


                    var enableInputs = formElement.querySelector('[name]');
                    var formValues = Array.from(enableInputs).reduce(function(values, input){
                        return (values[input.name] = input.value) && values;
                    }, {});
        
        
                    options.onSubmit(formValues);
                }
                // truong hop submit voi hanh vi mac dinh
                 else {
                    formElement.submit();
                    
                }
            }
        }


        // xu luy nhap qua moi rule va xu ly(lang nghe su kien  blur input)
        options.rules.forEach(function(rule){
            
            //luu lai rules cho moi input element
            if(Array.isArray(selectorRules[rule.selector])){
                selectorRules[rule.selector].push(rule.test);
            }   else {
                selectorRules[rule.selector] = [rule.test];
            }

            var inputElement = formElement.querySelector(rule.selector);
            
            if(inputElement){

                //su ly truong hop blur input
                inputElement.onblur = function(){
                    Validate(inputElement,rule);

                }

                //su li moi khi nguoi dung nhap vao input
                inputElement.oninput = function(){
                    var errorElement = inputElement.parentElement.querySelector(options.errorSelector);
                    errorElement.innerText ='';
                    inputElement.parentElement.classList.remove('invalid');
                }
                
            }
        });

    }   
}

//dinh nghia cac rules
// nghuyen tac cua cac rules
// khi co loi thi tra ra mess loi
// khi hợp lệ o trả ra cái gì cả (undefined)
Validator.isRequired = function(selector,message){
    return {
        selector: selector,
        test: function(value){
            return value.trim() ? undefined : message||  'vui lòng nhập trường này';
        }

    };
}

Validator.isEmail = function(selector, message){
    return {
        selector: selector,
        test: function(value){
            var regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/ ;    
            return regex.test(value) ? undefined : message || 'vui lòng trường này phải email';
        }

    };
}

Validator.minLength = function(selector, min, message){
    return {
        selector: selector,
        test: function(value){
          return value.length >= min ? undefined : message || `Nhập đúng ký tự và tối thiểu ${min} ký tự`;
        }

    };
}

Validator.isConfirmed = function(selector, getConfirmValue, message) {
    return {
        selector: selector,
        test: function(value){
            return value === getConfirmValue() ? undefined : message || 'Giá trị nhập vào không chính xác';
        }
    }
}
