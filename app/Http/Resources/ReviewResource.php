<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ReviewResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'order_id' => $this->order_id,
            'order_number' => $this->order_number,
            'order_item_id' => $this->order_item_id,
            'product_id' => $this->product_id,
            'product_name' => $this->product_name,
            'user_id' => $this->user_id,
            'user_name' => $this->user_name, // Use snapshot instead of relationship
            'score' => $this->score,
            'review' => $this->review,
            'created_at' => $this->created_at,
        ];
    }
}
