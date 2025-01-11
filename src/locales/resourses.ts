/* eslint-disable max-len */
const ruResources = {
    translation: {
        title: 'Добро пожаловать в Polycycles!',
        results: {
            exist: 'Есть',
            notExist: 'Нет',
            limitCyclesMultiplicityTwo: {
                label: 'Кратность два',
            },
            limitCyclesMultiplicityThree: {
                label: 'Кратность три',
            },
            limitCyclesCount: {
                label: 'Количество предельных циклов',
            },
        },
        toolbar: {
            isMonodromic: 'Монодромный',
            characterNumbers: 'Характеристические числа',
            charNumHelpText: 'Введите положительное число',
            charNumInputInfo:
                'Характеристическое число соответствует седлу, ориентация которого отличается от двух других седел.',
        },
        charNumsTool: {
            roolDesc: 'Необходимо ввести три положительных числа, удовлетворяющих условиям:',
            rools: [
                'Все числа отличны от 1',
                'Попарные произведения чисел отличны от 1',
                'Произведение всех трёх чисел отлично от 1',
            ],
        },
        drawInfo: {
            polycycle: {
                label: 'Полицикл',
                hover: 'Рядом с каждым седлом указано его характеристическое значение: модуль отношения собственных чисел, где отрицательное стоит в знаменателе.',
                monodromic: {
                    hover: 'Монодромный полицикл из трёх сёдел. ',
                },
                notMonodromic: {
                    hover: 'Немонодромный полицикл из трёх сёдел. ',
                },
            },
            simplex: {
                label: 'Симплекс',
                hover: `Изображённый симплекс — это один из четырёх симплексов на проективном пространстве RP 2, ограниченных прямыми z1 = 0, z2 = 0, z3 = 0. 
                Синее множество соответсвует двукратным циклам. Зелёная прямая — трёхкратным.`,
            },
            unfold: {
                label: 'Развертка',
                hover: `В центре развертки расположен симплекс, рёбра и вершины которого расширены до трапеций и ромбов. 
                Синее множество, соответствующее двукратным циклам, при этом превращается в синюю ломаную. Зелёная ломаная также соответствует трёхкратным циклам.`,
            },
            diagram: {
                label: 'Бифуркационная диаграмма',
                hover: `Бифуркационная диаграмма типичного трёхпараметрического семейства. 
                Чёрные точки соответствуют рождающимся в семействе лункам, чёрные дуги окружности — петлям, синяя кривая соответствует двухкратным циклам, а её каспы — трёхкратным.`,
            },
        },
        drawDiagram: {
            notTypicalCase: 'Нетипичный случай.',
        },
    },
};
const enResources = {
    translation: {
        title: 'Welcome to Polycycles!',
        results: {
            exist: 'Yes',
            notExist: 'No',
            limitCyclesMultiplicityTwo: {
                label: 'Multiplicity two',
            },
            limitCyclesMultiplicityThree: {
                label: 'Multiplicity three',
            },
            limitCyclesCount: {
                label: 'Limit cycles count',
            },
        },
        toolbar: {
            isMonodromic: 'Is monodromic',
            characterNumbers: 'Characteristic numbers',
            charNumHelpText: 'Input positive number',
            charNumInputInfo:
                'This characteristic number corresponds to the saddle with orientation that differs from the others.',
        },
        charNumsTool: {
            roolDesc:
                'You need to input three positive numbers satisfying the following conditions:',
            rools: [
                'Every number differs from 1',
                'Products of any two numbers differs from 1',
                'Product of all three numbers differs from 1',
            ],
        },
        drawInfo: {
            polycycle: {
                label: 'Polycycle',
                hover: 'A number near every saddle is the its characteristic number, i.e. the modulo of ratio of its eigenvalues where the negative one is in the numerator.',
                monodromic: {
                    hover: 'A monodromial polycycle formed by three saddles. ',
                },
                notMonodromic: {
                    hover: 'A non-monodromial polycycle formed by three saddles. ',
                },
            },
            simplex: {
                label: 'Simplex',
                hover: `This symplex is one of four symplexes that bounded by lines z1 = 0, z2 = 0, z3 = 0 on the projective plane RP 2. 
                The blue set corresponds to the cycles of multiplicity two. The green line corresponds to the cycles of multiplicity three.`,
            },
            unfold: {
                label: 'Unfolding',
                hover: `The unfolding is the same symplex but its edges and vertices are expanded by trapezoids and rhombi. 
                At the same time the blue set, which corresponds to limit cycles of multiplicity two, turns into a blue chain line. 
                The green line, which corresponds to limit cycles of multiplicity three, turns to a green chain line.`,
            },
            diagram: {
                label: 'Bifurcation diagram',
                hover: `A bifurcation diagram of a generic family. The black points correspond to appearing lunes, the black arcs of the circle correspond to loops. 
                The blue line corresponds to limit cycles of multiplicity two; its cusps corresponds to limit cycles of multiplicity three.`,
            },
        },
        drawDiagram: {
            notTypicalCase: 'Non-generic case.',
        },
    },
};

const resources = {
    ru: ruResources,
    en: enResources,
};

export type CharNumsRoolsType = typeof ruResources.translation.charNumsTool.rools;
export default resources;
