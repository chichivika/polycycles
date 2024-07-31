import { Points, ProjectivePoint } from 'utils/drawUtils';
import { mapProjectiveToDescartNotMonodromic} from 'utils/drawUtils';
import ClassUnfoldBase from './ClassUnfoldBase';
import { ClassParam } from './ClassUnfoldBase';


type ClassObjectCreate = {
    isMonodromic: boolean,
    drawSetting: ClassParam
}

// Monodromic case
class ClassUnfoldMonodromic extends ClassUnfoldBase {
}
// Not monodromic case
class ClassUnfoldNotMonodromic extends ClassUnfoldBase {
    _mapProjectiveToDescart(aZets1: ProjectivePoint, aVerts: Points) {
        return mapProjectiveToDescartNotMonodromic(aZets1, aVerts);
    }
}


function createUnfoldObject(oParam: ClassObjectCreate) {
    if (oParam.isMonodromic) {
        return new ClassUnfoldMonodromic(oParam.drawSetting);
    }
    return new ClassUnfoldNotMonodromic(oParam.drawSetting);
}
export default createUnfoldObject;