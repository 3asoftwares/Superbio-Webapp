export const FILTERS = [
    {
        name: "Dates",
        key: "postedAt",
    },
    {
        name: "Sheets",
        key: "internalSheetId",
    },
    {
        name: "Types",
        key: "postType",
    },
    {
        name: "Phases",
        key: "phase",
    },
    {
        name: "Category",
        key: "category",
    },
    {
        name: "Sub Category",
        key: "subCategory",
    },
]

export default class CampaignReportingFilter {
    private filters: FilterKeys[] = [];
    private selectedFilters: string[] = [];
    private selectedValues: string[] = [];
    private availablePlatforms: string[] = [];
    private availableSheets: SheetFilter[] = [];
    private availableValueTypes: string[] = [];
    private availableDates: string[] = [];
    private availablePhases: string[] = [];
    private availableCategrories: string[] = [];
    private availableSubcategories: string[] = [];
    

    constructor( filters: FilterKeys[] ) {
        this.filters = filters;
        this.filterLoad();
    }

    private filterLoad(): void {
        this.filters.forEach( (filter: FilterKeys) => {
            this.availablePlatforms = this.availablePlatforms.concat(filter.platforms);
            this.availableSheets = this.availableSheets.concat(filter.sheets ? filter.sheets : []);
            // this.availableOthers = this.availableOthers.concat(filter.others ? filter.others : []);
            this.availableDates = this.availableDates.concat(filter.value);
            this.availableValueTypes = this.availableValueTypes.concat(filter.postType);
            
            if (filter.others) {
                for (let value of filter.others) {
                    let columnName = value.columnName.toLowerCase();
                    if (columnName.includes('phase')) {
                        this.availablePhases.push(value.value);
                    } else if (columnName === 'category') {
                        this.availableCategrories.push(value.value);
                    } else if (columnName === 'subcategory') {
                        this.availableSubcategories.push(value.value);
                    }
                }
            }
        });

        // Remove duplicates
        this.uniqueFilters();
    }
    
    public getAvailableFilters(): AvailableFilters {
        return {
            platform: this.availablePlatforms,
            internalSheetId: this.availableSheets,
            postType: this.availableValueTypes,
            postedAt: this.availableDates,
            phase: this.availablePhases,
            category: this.availableCategrories,
            subCategory: this.availableSubcategories,
        };
    }

    public getSelectedFilters(): {
        filters: string[];
        values: string[];
    } {
        return {
            filters: this.selectedFilters,
            values: this.selectedValues
        };
    }

    private uniqueFilters(): void {
        this.availableSheets = this.availableSheets.filter(({ _id: { $oid } }, index) => this.availableSheets.findIndex(item => item._id.$oid === $oid) === index);
        // this.availableOthers = this.availableOthers.filter(({ columnName }, index) => this.availableOthers.findIndex(item => item.columnName === columnName) === index);
        this.availableDates = this.availableDates.filter((item, index) => this.availableDates.indexOf(item) === index);
        this.availableValueTypes = this.availableValueTypes.filter((item, index) => this.availableValueTypes.indexOf(item) === index);
        this.availablePlatforms = this.availablePlatforms.filter((item, index) => this.availablePlatforms.indexOf(item) === index);
        this.availablePhases = this.availablePhases.filter((item, index) => this.availablePhases.indexOf(item) === index);
        this.availableCategrories = this.availableCategrories.filter((item, index) => this.availableCategrories.indexOf(item) === index);
        this.availableSubcategories = this.availableSubcategories.filter((item, index) => this.availableSubcategories.indexOf(item) === index);
    }

    private resetFilters(): void {
        this.availableDates = [];
        this.availablePlatforms = [];
        this.availableSheets = [];
        this.availableValueTypes = [];
        this.availablePhases = [];
        this.availableCategrories = [];
        this.availableSubcategories = [];
    }

    public setSelectedFilters(filters: string[], values: string[]): AvailableFilters {
        this.selectedFilters = filters;
        this.selectedValues = values;
        this.reassignFilters();
        return this.getAvailableFilters();
    }

    private reassignFilters(): void {
        this.resetFilters();
        for (let filter of this.selectedFilters) {
            let value = this.selectedValues[this.selectedFilters.indexOf(filter)];
            filter = filter.toLowerCase();
            if (filter === 'platforms') {
                this.availablePlatforms = this.filters.map(item => item.platforms).reduce((a, b) => a.concat(b), []);
                this.filters = this.filters.filter(item => item.platforms.includes(value));
                this.availableDates = this.filters.map(item => item.value);
                this.availableSheets = this.filters.map(item => item.sheets ? item.sheets : []).reduce((a, b) => a.concat(b), []);
                // this.availableOthers = this.filters.map(item => item.others ? item.others : []).reduce((a, b) => a.concat(b), []);
                this.availableValueTypes = this.filters.map(item => item.postType ? item.postType : []).reduce((a, b) => a.concat(b), []);

                this.availablePhases = this.filters.map(item => item.others ? item.others : []).reduce((a, b) => a.concat(b), []).filter(item => item.columnName.toLowerCase().includes('phase')).map(item => item.value);
                this.availableCategrories = this.filters.map(item => item.others ? item.others : []).reduce((a, b) => a.concat(b), []).filter(item => item.columnName.toLowerCase() === 'category').map(item => item.value);
                this.availableSubcategories = this.filters.map(item => item.others ? item.others : []).reduce((a, b) => a.concat(b), []).filter(item => item.columnName.toLowerCase() === 'subcategory').map(item => item.value);
            } else if (filter === 'sheets') {
                let sheets = value.split('_');
                this.availableSheets = this.filters.map(item => item.sheets ? item.sheets : []).reduce((a, b) => a.concat(b), []);
                this.filters = this.filters.filter(item => item.sheets ? sheets.includes(item.sheets[0].name) : false);
                this.availablePlatforms = this.filters.map(item => item.platforms).reduce((a, b) => a.concat(b), []);
                this.availableDates = this.filters.map(item => item.value);
                // this.availableOthers = this.filters.map(item => item.others ? item.others : []).reduce((a, b) => a.concat(b), []);
                this.availableValueTypes = this.filters.map(item => item.postType ? item.postType : []).reduce((a, b) => a.concat(b), []);

                this.availablePhases = this.filters.map(item => item.others ? item.others : []).reduce((a, b) => a.concat(b), []).filter(item => item.columnName.toLowerCase().includes('phase')).map(item => item.value);
                this.availableCategrories = this.filters.map(item => item.others ? item.others : []).reduce((a, b) => a.concat(b), []).filter(item => item.columnName.toLowerCase() === 'category').map(item => item.value);
                this.availableSubcategories = this.filters.map(item => item.others ? item.others : []).reduce((a, b) => a.concat(b), []).filter(item => item.columnName.toLowerCase() === 'subcategory').map(item => item.value);
            } else if (filter === 'category') {
                let others = value.split('_');
                this.availableCategrories = this.filters.map(item => item.others ? item.others : []).reduce((a, b) => a.concat(b), []).filter(item => item.columnName.toLowerCase() === 'category').map(item => item.value);
                this.filters = this.filters.filter(item => item.others ? others.map(other => item?.others?.map(o => o.value).includes(other)).includes(true) : false);
                this.availablePlatforms = this.filters.map(item => item.platforms).reduce((a, b) => a.concat(b), []);
                this.availableDates = this.filters.map(item => item.value);
                this.availableSheets = this.filters.map(item => item.sheets ? item.sheets : []).reduce((a, b) => a.concat(b), []);
                this.availableValueTypes = this.filters.map(item => item.postType ? item.postType : []).reduce((a, b) => a.concat(b), []);
                this.availablePhases = this.filters.map(item => item.others ? item.others : []).reduce((a, b) => a.concat(b), []).filter(item => item.columnName.toLowerCase().includes('phase')).map(item => item.value);
                this.availableSubcategories = this.filters.map(item => item.others ? item.others : []).reduce((a, b) => a.concat(b), []).filter(item => item.columnName.toLowerCase() === 'subcategory').map(item => item.value);
            } else if (filter === 'subcategory') {
                let others = value.split('_');
                this.availableSubcategories = this.filters.map(item => item.others ? item.others : []).reduce((a, b) => a.concat(b), []).filter(item => item.columnName.toLowerCase() === 'subcategory').map(item => item.value);
                this.filters = this.filters.filter(item => item.others ? others.map(other => item?.others?.map(o => o.value).includes(other)).includes(true) : false);
                this.availablePlatforms = this.filters.map(item => item.platforms).reduce((a, b) => a.concat(b), []);
                this.availableDates = this.filters.map(item => item.value);
                this.availableSheets = this.filters.map(item => item.sheets ? item.sheets : []).reduce((a, b) => a.concat(b), []);
                this.availableValueTypes = this.filters.map(item => item.postType ? item.postType : []).reduce((a, b) => a.concat(b), []);
                this.availablePhases = this.filters.map(item => item.others ? item.others : []).reduce((a, b) => a.concat(b), []).filter(item => item.columnName.toLowerCase().includes('phase')).map(item => item.value);
                this.availableCategrories = this.filters.map(item => item.others ? item.others : []).reduce((a, b) => a.concat(b), []).filter(item => item.columnName.toLowerCase() === 'category').map(item => item.value);
            } else if (filter.includes('phase')) {
                let others = value.split('_');
                this.availablePhases = this.filters.map(item => item.others ? item.others : []).reduce((a, b) => a.concat(b), []).filter(item => item.columnName.toLowerCase().includes('phase')).map(item => item.value);
                this.filters = this.filters.filter(item => item.others ? others.map(other => item?.others?.map(o => o.value).includes(other)).includes(true) : false);
                this.availablePlatforms = this.filters.map(item => item.platforms).reduce((a, b) => a.concat(b), []);
                this.availableDates = this.filters.map(item => item.value);
                this.availableSheets = this.filters.map(item => item.sheets ? item.sheets : []).reduce((a, b) => a.concat(b), []);
                this.availableValueTypes = this.filters.map(item => item.postType ? item.postType : []).reduce((a, b) => a.concat(b), []);
                this.availableCategrories = this.filters.map(item => item.others ? item.others : []).reduce((a, b) => a.concat(b), []).filter(item => item.columnName.toLowerCase() === 'category').map(item => item.value);
                this.availableSubcategories = this.filters.map(item => item.others ? item.others : []).reduce((a, b) => a.concat(b), []).filter(item => item.columnName.toLowerCase() === 'subcategory').map(item => item.value);
            } else if (filter === 'posttype') {
                let valueTypes = value.split('_');
                this.availableValueTypes = this.filters.map(item => item.postType ? item.postType : []).reduce((a, b) => a.concat(b), []);
                this.filters = this.filters.filter(item => item.postType ? valueTypes.map(other => item?.postType?.includes(other)).includes(true) : false);
                this.availablePlatforms = this.filters.map(item => item.platforms).reduce((a, b) => a.concat(b), []);
                this.availableDates = this.filters.map(item => item.value);
                this.availableSheets = this.filters.map(item => item.sheets ? item.sheets : []).reduce((a, b) => a.concat(b), []);
                this.availablePhases = this.filters.map(item => item.others ? item.others : []).reduce((a, b) => a.concat(b), []).filter(item => item.columnName.toLowerCase().includes('phase')).map(item => item.value);
                this.availableCategrories = this.filters.map(item => item.others ? item.others : []).reduce((a, b) => a.concat(b), []).filter(item => item.columnName.toLowerCase() === 'category').map(item => item.value);
                this.availableSubcategories = this.filters.map(item => item.others ? item.others : []).reduce((a, b) => a.concat(b), []).filter(item => item.columnName.toLowerCase() === 'subcategory').map(item => item.value);
            } else if (filter === 'postedat') {
                let dates = value.split('_');
                this.availableDates = this.filters.map(item => item.value);
                this.filters = this.filters.filter(item => dates.includes(item.value));
                this.availablePlatforms = this.filters.map(item => item.platforms).reduce((a, b) => a.concat(b), []);
                this.availableSheets = this.filters.map(item => item.sheets ? item.sheets : []).reduce((a, b) => a.concat(b), []);
                this.availableValueTypes = this.filters.map(item => item.postType ? item.postType : []).reduce((a, b) => a.concat(b), []);
                this.availablePhases = this.filters.map(item => item.others ? item.others : []).reduce((a, b) => a.concat(b), []).filter(item => item.columnName.toLowerCase().includes('phase')).map(item => item.value);
                this.availableCategrories = this.filters.map(item => item.others ? item.others : []).reduce((a, b) => a.concat(b), []).filter(item => item.columnName.toLowerCase() === 'category').map(item => item.value);
                this.availableSubcategories = this.filters.map(item => item.others ? item.others : []).reduce((a, b) => a.concat(b), []).filter(item => item.columnName.toLowerCase() === 'subcategory').map(item => item.value);
            } else {
                this.availablePlatforms = this.filters.map(item => item.platforms).reduce((a, b) => a.concat(b), []);
                this.availableSheets = this.filters.map(item => item.sheets ? item.sheets : []).reduce((a, b) => a.concat(b), []);
                this.availableDates = this.filters.map(item => item.value);
                this.availableValueTypes = this.filters.map(item => item.postType ? item.postType : []).reduce((a, b) => a.concat(b), []);
                this.availablePhases = this.filters.map(item => item.others ? item.others : []).reduce((a, b) => a.concat(b), []).filter(item => item.columnName.toLowerCase().includes('phase')).map(item => item.value);
                this.availableCategrories = this.filters.map(item => item.others ? item.others : []).reduce((a, b) => a.concat(b), []).filter(item => item.columnName.toLowerCase() === 'category').map(item => item.value);
                this.availableSubcategories = this.filters.map(item => item.others ? item.others : []).reduce((a, b) => a.concat(b), []).filter(item => item.columnName.toLowerCase() === 'subcategory').map(item => item.value);
            }   

        }
        
        this.uniqueFilters();
    }

}

