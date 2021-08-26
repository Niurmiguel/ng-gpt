export type SingleSizeArray = number[];
export type NamedSize = string | string[];
export type SingleSize = SingleSizeArray | NamedSize;
export type MultiSize = SingleSize[];
export type GeneralSize = SingleSize | MultiSize;
export type SizeMapping = GeneralSize[];
export type SizeMappingArray = SizeMapping[];
