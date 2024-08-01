import ClassUnfoldBase from './ClassUnfoldBase';
import { ClassParam } from './ClassUnfoldBase';


function createUnfoldObject(oParam: ClassParam) {
    return new ClassUnfoldBase(oParam);
}
export default createUnfoldObject;