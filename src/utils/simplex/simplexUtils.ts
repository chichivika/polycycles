import ClassSimplexBase from './ClassSimplexBase';
import { ClassParam } from './ClassSimplexBase';


function createSimplexObject(oParam: ClassParam) {
    return new ClassSimplexBase(oParam);
}
export default createSimplexObject;