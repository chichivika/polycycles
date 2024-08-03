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
            rools: ['Все числа отличны от 1', 'Попарные произведения чисел отличны от 1', 'Произведение всех трёх чисел отлично от 1']
        },
        drawInfo: {
            polycycle: {
                label: 'Полицикл',
                hover: `Полицикл из трёх сёдел. Рядом с каждым седлом указано его характеристическое значение: модуль отношения собственных чисел, где отрицательное стоит в знаменателе.`
            },
            simplex: {
                label: 'Симплекс',
                hover: `Изображённый треугольник — это один из четырёх симплексов на проективном пространстве RP 2, ограниченных прямыми z1 = 0, z2 = 0, z3 = 0. 
                Синее множество соответсвует двукратным циклам. Зелёная прямая — трёхкратным.`
            },
            unfold: {
                label: 'Развертка',
                hover: `В центре развертки расположен симплекс, рёбра и вершины которого расширены до трапеций и ромбов. 
                Синее множество, соответствующее двукратным циклам, при этом превращается в синюю ломаную. Зелёная ломаная также соответствует трёхкратным циклам.`
            },
            diagram: {
                label: 'Бифуркационная диаграмма',
                hover: `Бифуркационная диаграмма типичного трёхпараметрического семейства. 
                Чёрные точки соответствуют рождающимся в семействе лункам, чёрные дуги окружности — петлям, синяя кривая соответствует двухкратным циклам, а её каспы — трёхкратным.`
            }
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
        drawInfo: {
            polycycle: {
                label: 'Polycycle',
                hover: `Полицикл из трёх сёдел. Рядом с каждым седлом указано его характеристическое значение: модуль отношения собственных чисел, где отрицательное стоит в знаменателе.`
            },
            simplex: {
                label: 'Simplex',
                hover: `Изображённый треугольник — это один из четырёх симплексов на проективном пространстве RP 2, ограниченных прямыми z1 = 0, z2 = 0, z3 = 0. 
                Синее множество соответсвует двукратным циклам. Зелёная прямая — трёхкратным.`
            },
            unfold: {
                label: 'Unfolding',
                hover: `В центре развертки расположен симплекс, рёбра и вершины которого расширены до трапеций и ромбов. 
                Синее множество, соответствующее двукратным циклам, при этом превращается в синюю ломаную. Зелёная ломаная также соответствует трёхкратным циклам.`
            },
            diagram: {
                label: 'Bifurcation diagram',
                hover: `Бифуркационная диаграмма типичного трёхпараметрического семейства. 
                Чёрные точки соответствуют рождающимся в семействе лункам, чёрные дуги окружности — петлям, синяя кривая соответствует двухкратным циклам, а её каспы — трёхкратным.`
            }
        }
    }
};

const resources = {
    ru: ruResources,
    en: enResources
};

export type CharNumsRoolsType = typeof ruResources.translation.charNumsTool.rools;
export default resources;