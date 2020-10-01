export enum SortOrder {
	Asc = "asc",
	Desc = "desc"
};

export enum Column {
	Title = "title",
	User = "user",
	Date = "date"
}

export interface SortOptions {
	column: Column;
	order: SortOrder;
};