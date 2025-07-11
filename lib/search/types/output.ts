export type RatingItem = {
  ratingAction: string;
  country: string;
  koNumber: string;
  releaseDate: string;
  inn: string;
  objectType: string;
  ratingValue: string;
  prediction: string;
  objectName: string;
  kraName: string;
  releaseUrl: string;
  objectId: string;
  isin: string;
  subjectName: string;
};

export type SearchRatingResponse = {
  status: string; // 'success' | 'error'
  data: {
    pageCount: number;
    pageNumber: number;
    sortingField: string;
    sortingDirection: string;
    pageSize: number;
    itemList: RatingItem[];
    itemCount: number;
  } | null;
  errors: { message: string; code: number; customData: any }[];
};
