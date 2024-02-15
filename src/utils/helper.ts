export function getUniqueRecordsByField(
    input: any[][],
    uniqueField: any,
    type:"single" | "multi"
): any[] {
    const uniqueRecordsMap = new Map<any, any>();
    const uniqueRecords: any[] = [];
    if(type == "multi"){

        input.forEach((recordsGroup: any[]) => {
            recordsGroup.forEach((record: any) => {
                const fieldValue = record[uniqueField];
                if (!uniqueRecordsMap.has(fieldValue)) {
                    uniqueRecordsMap.set(fieldValue, record);
                    uniqueRecords.push(record);
                }
            });
        });

    }else{
        for (const record of input) {
            uniqueRecordsMap.set(record[uniqueField], record);
        }
        uniqueRecordsMap.forEach((record) => {
            uniqueRecords.push(record);
        });
    }
    return uniqueRecords;
}
