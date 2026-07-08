import React from 'react'
import { Star, User } from 'lucide-react'

type reviewProps ={
    rating? : number;
    comment?: string;
    name?: string;
    date?:string;
    className?: string;
}

const ReviewCard = ({ rating = 0, comment = '', name = 'Anonymous', date , className}: reviewProps) => {
  
  const formattedDate = date 
    ? new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : '';

  return (
    <div className={`bg-surface p-6 hover:shadow-md transition-all duration-300 flex flex-col gap-4 ${className}`}>
      
      <div className="flex items-center justify-between gap-4 ">
        <div className="flex items-center gap-3 lg:scale-110">
          <div className="w-10 h-10 rounded-full flex items-center justify-center bg-primary/10 text-primary border border-primary/20 shrink-0">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-semibold text-heading text-sm md:text-base">{name}</h4>
            {formattedDate && (
              <p className="text-xs text-text-muted mt-0.5">{formattedDate}</p>
            )}
          </div>
        </div>

        
        <div className="flex items-center gap-0.5 lg:scale-120 bg-background/50 px-2.5 py-1 rounded-lg border border-border">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`w-3.5 h-3.5 ${
                rating >= star
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-300"
              }`}
            />
          ))}
          <span className="text-xs font-semibold text-heading ml-1.5">{rating.toFixed(1)}</span>
        </div>
      </div>

      
      {comment && (
        <p className="text-base  md:text-l  text-text leading-relaxed italic bg-background/30 p-3.5 rounded-xl border border-border/50">
          "{comment}"
        </p>
      )}
    </div>
  )
}

export default ReviewCard

