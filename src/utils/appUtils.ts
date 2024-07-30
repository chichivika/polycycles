export function getClassName(sDefaultName:string, sName?: string): string {
    if (sName) {
        sDefaultName = sDefaultName.concat(` ${sName}`);
    }
    return sDefaultName;
}