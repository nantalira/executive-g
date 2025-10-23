import { publicApi } from "./api";

class MasterDataService {
    /**
     * Get all provinces with pagination and search
     */
    async getProvinces(page = 1, searchQuery = "", itemsPerPage = 15) {
        const params = new URLSearchParams({
            page: page.toString(),
            items_per_page: itemsPerPage.toString(),
        });

        if (searchQuery) {
            params.append("search", searchQuery);
        }

        const response = await publicApi.get(`/provinces?${params}`);
        return response.data;
    }

    /**
     * Get districts by province ID with pagination and search
     */
    async getDistricts(provinceId, page = 1, searchQuery = "", itemsPerPage = 15) {
        const params = new URLSearchParams({
            page: page.toString(),
            items_per_page: itemsPerPage.toString(),
        });

        if (searchQuery) {
            params.append("search", searchQuery);
        }

        const response = await publicApi.get(`/districts/${provinceId}?${params}`);
        return response.data;
    }

    /**
     * Get sub districts by district ID with pagination and search
     */
    async getSubDistricts(districtId, page = 1, searchQuery = "", itemsPerPage = 15) {
        const params = new URLSearchParams({
            page: page.toString(),
            items_per_page: itemsPerPage.toString(),
        });

        if (searchQuery) {
            params.append("search", searchQuery);
        }

        const response = await publicApi.get(`/sub-districts/${districtId}?${params}`);
        return response.data;
    }

    /**
     * Get villages by sub district ID with pagination and search
     */
    async getVillages(subDistrictId, page = 1, searchQuery = "", itemsPerPage = 15) {
        const params = new URLSearchParams({
            page: page.toString(),
            items_per_page: itemsPerPage.toString(),
        });

        if (searchQuery) {
            params.append("search", searchQuery);
        }

        const response = await publicApi.get(`/villages/${subDistrictId}?${params}`);
        return response.data;
    }
}

export default new MasterDataService();
