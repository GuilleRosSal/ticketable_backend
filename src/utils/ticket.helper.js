export const calculatePagination = (page, limit, totalElements) => {
  const lastPage = Math.ceil(totalElements / limit) || 1;

  const currentPage = Math.min(page, lastPage);

  const skip = (currentPage - 1) * limit;

  return { currentPage, lastPage, skip };
};

export const buildFilterWhereClause = ({ category, subcategory, email, state, creation_date }) => {
  const where = {};

  if (category || subcategory) {
    where.category = {};
    if (category) where.category.category = category;
    if (subcategory) where.category.subcategory = subcategory;
  }

  if (email) where.User = { email };
  if (state) where.state = state;
  if (creation_date) {
    const dateFilter = new Date(creation_date);
    where.creation_date = {
      lte: dateFilter,
    };
  }

  return where;
};
