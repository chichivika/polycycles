import { Points, ProjectivePoint } from 'utils/drawUtils';
import { mapProjectiveToDescartNotMonodromic} from 'utils/drawUtils';
import ClassSimplexBase from './ClassSimplexBase';
import { ClassParam } from './ClassSimplexBase';


type ClassObjectCreate = {
    isMonodromic: boolean,
    drawSetting: ClassParam
}

// Monodromic case
class ClassSimplexMonodromic extends ClassSimplexBase {
}
// Not monodromic case
class ClassSimplexNotMonodromic extends ClassSimplexBase {
    _getTripleLineProjectivePoints() {
        let aNums = this.charNums;

        let aZets: ProjectivePoint[] = [];
        if (aNums[2] + aNums[0] !== 2) {
            aZets.push([1 - aNums[2], 0, aNums[0] - 1]);
        }
        if (aNums[1] + aNums[0] !== 2) {
            aZets.push([1 - aNums[1], aNums[0] - 1, 0]);
        }
        if (aZets.length < 2) {
            aZets.push([2 - aNums[1] - aNums[2], aNums[0] - 1, aNums[0] - 1]);
        }
        return aZets;
    }
    _mapProjectiveToDescart(aZets1: ProjectivePoint, aVerts: Points) {
        return mapProjectiveToDescartNotMonodromic(aZets1, aVerts);
    }
}


function createSimplexObject(oParam: ClassObjectCreate) {
    if (oParam.isMonodromic) {
        return new ClassSimplexMonodromic(oParam.drawSetting);
    }
    return new ClassSimplexNotMonodromic(oParam.drawSetting);
}
export default createSimplexObject;