class APIFeatures{
    constructor(query,querString){
        this.query=query;
        this.querString=querString;
    }

    filter(){
        //build quey
        //1A] Filtering
        const queryObj = {...this.querString};
        const excludedFields = ['page','sort','limit','fields'];
        excludedFields.forEach(el=>delete queryObj[el]);

        //1B] advance filtering
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g,match=>`$${match}`);
        // console.log(JSON.parse(queryStr));
        
        this.query = this.query.find(JSON.parse(queryStr));
        return this;
    }
    sort(){
                //2] sorting filter
                if(this.querString.sort){
                    const sortBy = this.querString.sort.split(',').join(' ');
                    // console.log(sortBy);
                    this.query = this.query.sort(sortBy);
                }else{
                    this.query = this.query.sort('-createdAt');
                }
                return this;
    }
    limitFields(){
        //3] filelds filter
        if(this.querString.fields){
            const fields = this.querString.fields.split(',').join(' ');
            // console.log(sortBy);
            this.query = this.query.select(fields);
        }else{
            this.query = this.query.select('-__v');
        }
        return this;
    }
    paginate(){
                //4]pagination
                const page = this.querString.page * 1 || 1;
                const limit = this.querString.limit * 1 || 15;
                const skip = (page-1) * limit;
        
                this.query = this.query.skip(skip). limit(limit);
                return this;
                // if(req.query.page){
                //     const numTours = await Tour.countDocuments();
                //     if(skip >= numTours) throw new Error('This page does not exist');
                // }
    }
}

module.exports=APIFeatures;