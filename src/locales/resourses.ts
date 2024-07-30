const ruResources = {
    translation: {
        title: 'Добро пожаловать в Polycycles!',
        toolbar: {
            isMonodromic: 'Монодромный',
            characterNumbers: 'Характеристические числа',
            drawMe: 'Нарисуй!',
            charNumHelpText: 'Введите положительное число',
            charNumInputInfo: 'Характеристическое число соответствует седлу, ориентация которого отличается от двух других седел.'
        },
        charNumsTool: {
            roolDesc: 'Необходимо ввести три положительных числа, удовлетворяющих условиям:',
            rools: ['Все числа отличны от единицы' ,'Попарные произведения чисел отличны от 1','Произведение всех трёх чисел отлично от 1']
        },
        drawInfo:{
            isMonodromic: 'Монодромный полицикл',
            notMonodromic: 'Немонодромный полицикл',
            charNums: 'с характеристическими числами:'
        }
        
    }
};
const enResources = {
    translation: {
        title: 'Welcome to Polycycles!',
        toolbar: {
            isMonodromic: 'Is monodromic',
            characterNumbers: 'Characteristic numbers',
            drawMe: 'Draw!',
            charNumHelpText: 'Input positive number',
            charNumInputInfo: 'This characteristic number corresponds to the saddle with orientation that differs from the others.'
        },
        charNumsTool: {
            roolDesc: 'You need to input three positive numbers satisfying the following conditions:',
            rools: ['Every number differs from 1', 'Products of any two numbers differs from 1', 'Product of all three numbers differs from 1']
        },
        drawInfo:{
            isMonodromic: 'Monodromic polycycle',
            notMonodromic: 'Not monodromic polycycle',
            charNums: 'with characteristic numbers:'
        }
    }
};

const resources = {
    ru: ruResources,
    en: enResources
};

export type CharNumsRoolsType = typeof ruResources.translation.charNumsTool.rools;
export default resources;