import { Category, Region, Restaurant, RestaurantFormData } from "@/types";

const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "请求失败" }));
    throw new Error(error.error || "请求失败");
  }
  return response.json();
};

export const api = {
  async getRestaurants(): Promise<Restaurant[]> {
    return handleResponse<Restaurant[]>(await fetch("/api/restaurants"));
  },

  async createRestaurant(data: RestaurantFormData): Promise<Restaurant> {
    return handleResponse<Restaurant>(
      await fetch("/api/restaurants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
    );
  },

  async updateRestaurant(
    id: string,
    data: Partial<RestaurantFormData>
  ): Promise<Restaurant> {
    return handleResponse<Restaurant>(
      await fetch(`/api/restaurants/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
    );
  },

  async deleteRestaurant(id: string): Promise<void> {
    await handleResponse<{ success: boolean }>(
      await fetch(`/api/restaurants/${id}`, { method: "DELETE" })
    );
  },

  async getCategories(): Promise<Category[]> {
    return handleResponse<Category[]>(await fetch("/api/categories"));
  },

  async createCategory(name: string): Promise<Category> {
    return handleResponse<Category>(
      await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      })
    );
  },

  async updateCategory(id: string, name: string): Promise<Category> {
    return handleResponse<Category>(
      await fetch(`/api/categories/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      })
    );
  },

  async deleteCategory(id: string): Promise<void> {
    await handleResponse<{ success: boolean }>(
      await fetch(`/api/categories/${id}`, { method: "DELETE" })
    );
  },

  async getRegions(parentId?: string | null): Promise<Region[]> {
    const params = new URLSearchParams();
    if (parentId !== undefined) {
      params.set("parentId", parentId ?? "null");
    }
    return handleResponse<Region[]>(
      await fetch(`/api/regions?${params.toString()}`)
    );
  },

  async uploadImage(file: File): Promise<string> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await handleResponse<{ url: string }>(response);
    return data.url;
  },
};
