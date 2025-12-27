/**
 * API Features - معالجة الفلترة والترتيب والتصفح
 * يوفر وظائف للبحث والفلترة والترتيب والتصفح في API
 */
class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  /**
   * Filter - فلترة النتائج
   */
  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'limit', 'fields', 'search'];
    excludedFields.forEach((el) => delete queryObj[el]);

    // Advanced filtering with operators
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt|in)\b/g, (match) => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  /**
   * Search - البحث في الحقول
   */
  search(searchFields = []) {
    if (this.queryString.search) {
      const searchRegex = {
        $regex: this.queryString.search,
        $options: 'i', // case insensitive
      };

      if (searchFields.length > 0) {
        const searchConditions = searchFields.map((field) => ({
          [field]: searchRegex,
        }));
        this.query = this.query.find({ $or: searchConditions });
      } else {
        // البحث في جميع الحقول النصية
        this.query = this.query.find({
          $or: [
            { name: searchRegex },
            { title: searchRegex },
            { description: searchRegex },
            { email: searchRegex },
          ],
        });
      }
    }
    return this;
  }

  /**
   * Sort - ترتيب النتائج
   */
  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      // الترتيب الافتراضي: الأحدث أولاً
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }

  /**
   * Limit Fields - تحديد الحقول المراد إرجاعها
   */
  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      // استثناء __v من النتائج
      this.query = this.query.select('-__v');
    }
    return this;
  }

  /**
   * Paginate - تصفح النتائج
   */
  paginate() {
    const page = parseInt(this.queryString.page, 10) || 1;
    const limit = parseInt(this.queryString.limit, 10) || 10;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    // إضافة معلومات التصفح للاستخدام لاحقاً
    this.pagination = {
      page,
      limit,
      skip,
    };

    return this;
  }

  /**
   * Get Pagination Info
   * الحصول على معلومات التصفح
   */
  async getPaginationInfo(totalDocs) {
    const page = this.pagination?.page || 1;
    const limit = this.pagination?.limit || 10;
    const totalPages = Math.ceil(totalDocs / limit);

    return {
      currentPage: page,
      totalPages,
      totalDocs,
      limit,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    };
  }
}

module.exports = APIFeatures;

