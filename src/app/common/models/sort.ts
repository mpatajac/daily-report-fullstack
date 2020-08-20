export enum SortOrder {
	Asc = "asc",
	Desc = "desc"
};

export enum Column {
	Name = "name",
	User = "user",
	Date = "date"
}

export interface SortOptions {
	column: Column;
	order: SortOrder;
};