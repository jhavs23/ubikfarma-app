/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getPaymentTransaction = /* GraphQL */ `
  query GetPaymentTransaction($id: ID!) {
    getPaymentTransaction(id: $id) {
      id
      user_id
      amount_usd
      status
      reference_number
      bank_origin
      voucher_url
      created_at
      createdAt
      updatedAt
      owner
      __typename
    }
  }
`;
export const listPaymentTransactions = /* GraphQL */ `
  query ListPaymentTransactions(
    $filter: ModelPaymentTransactionFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listPaymentTransactions(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        user_id
        amount_usd
        status
        reference_number
        bank_origin
        voucher_url
        created_at
        createdAt
        updatedAt
        owner
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getPharmacyEmployeeAudit = /* GraphQL */ `
  query GetPharmacyEmployeeAudit($id: ID!) {
    getPharmacyEmployeeAudit(id: $id) {
      id
      pharmacy_id
      employee_user_id
      quote_request_id
      action
      timestamp
      createdAt
      updatedAt
      owner
      __typename
    }
  }
`;
export const listPharmacyEmployeeAudits = /* GraphQL */ `
  query ListPharmacyEmployeeAudits(
    $filter: ModelPharmacyEmployeeAuditFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listPharmacyEmployeeAudits(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        pharmacy_id
        employee_user_id
        quote_request_id
        action
        timestamp
        createdAt
        updatedAt
        owner
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getDistributorProfile = /* GraphQL */ `
  query GetDistributorProfile($id: ID!) {
    getDistributorProfile(id: $id) {
      id
      company_name
      rif
      catalog_url
      contact_whatsapp
      createdAt
      updatedAt
      owner
      __typename
    }
  }
`;
export const listDistributorProfiles = /* GraphQL */ `
  query ListDistributorProfiles(
    $filter: ModelDistributorProfileFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listDistributorProfiles(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        company_name
        rif
        catalog_url
        contact_whatsapp
        createdAt
        updatedAt
        owner
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getGlobalProductCatalog = /* GraphQL */ `
  query GetGlobalProductCatalog($id: ID!) {
    getGlobalProductCatalog(id: $id) {
      id
      active_ingredient
      brand_name
      presentation
      barcodes
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const listGlobalProductCatalogs = /* GraphQL */ `
  query ListGlobalProductCatalogs(
    $filter: ModelGlobalProductCatalogFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listGlobalProductCatalogs(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        active_ingredient
        brand_name
        presentation
        barcodes
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getPharmacyInventory = /* GraphQL */ `
  query GetPharmacyInventory($id: ID!) {
    getPharmacyInventory(id: $id) {
      id
      pharmacy_id
      global_product_id
      custom_name
      price_usd
      price_bs
      stock_quantity
      is_available
      createdAt
      updatedAt
      owner
      __typename
    }
  }
`;
export const listPharmacyInventories = /* GraphQL */ `
  query ListPharmacyInventories(
    $filter: ModelPharmacyInventoryFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listPharmacyInventories(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        pharmacy_id
        global_product_id
        custom_name
        price_usd
        price_bs
        stock_quantity
        is_available
        createdAt
        updatedAt
        owner
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getPharmacyStats = /* GraphQL */ `
  query GetPharmacyStats($id: ID!) {
    getPharmacyStats(id: $id) {
      id
      pharmacy_id
      total_quotes_received
      total_quotes_responded
      conversion_rate
      average_response_time
      top_medicines
      monthly_data
      updated_at
      createdAt
      updatedAt
      owner
      __typename
    }
  }
`;
export const listPharmacyStats = /* GraphQL */ `
  query ListPharmacyStats(
    $filter: ModelPharmacyStatsFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listPharmacyStats(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        pharmacy_id
        total_quotes_received
        total_quotes_responded
        conversion_rate
        average_response_time
        top_medicines
        monthly_data
        updated_at
        createdAt
        updatedAt
        owner
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getSearchHistory = /* GraphQL */ `
  query GetSearchHistory($id: ID!) {
    getSearchHistory(id: $id) {
      id
      user_id
      search_term
      medicine_name
      state
      city
      created_at
      createdAt
      updatedAt
      owner
      __typename
    }
  }
`;
export const listSearchHistories = /* GraphQL */ `
  query ListSearchHistories(
    $filter: ModelSearchHistoryFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listSearchHistories(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        user_id
        search_term
        medicine_name
        state
        city
        created_at
        createdAt
        updatedAt
        owner
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getChatMessage = /* GraphQL */ `
  query GetChatMessage($id: ID!) {
    getChatMessage(id: $id) {
      id
      quote_request_id
      sender_id
      sender_type
      message
      read
      created_at
      createdAt
      updatedAt
      owner
      __typename
    }
  }
`;
export const listChatMessages = /* GraphQL */ `
  query ListChatMessages(
    $filter: ModelChatMessageFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listChatMessages(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        quote_request_id
        sender_id
        sender_type
        message
        read
        created_at
        createdAt
        updatedAt
        owner
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const pharmacyEmployeeAuditsByPharmacy_id = /* GraphQL */ `
  query PharmacyEmployeeAuditsByPharmacy_id(
    $pharmacy_id: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelPharmacyEmployeeAuditFilterInput
    $limit: Int
    $nextToken: String
  ) {
    pharmacyEmployeeAuditsByPharmacy_id(
      pharmacy_id: $pharmacy_id
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        pharmacy_id
        employee_user_id
        quote_request_id
        action
        timestamp
        createdAt
        updatedAt
        owner
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const globalProductCatalogsByActive_ingredient = /* GraphQL */ `
  query GlobalProductCatalogsByActive_ingredient(
    $active_ingredient: String!
    $sortDirection: ModelSortDirection
    $filter: ModelGlobalProductCatalogFilterInput
    $limit: Int
    $nextToken: String
  ) {
    globalProductCatalogsByActive_ingredient(
      active_ingredient: $active_ingredient
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        active_ingredient
        brand_name
        presentation
        barcodes
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const pharmacyInventoriesByPharmacy_id = /* GraphQL */ `
  query PharmacyInventoriesByPharmacy_id(
    $pharmacy_id: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelPharmacyInventoryFilterInput
    $limit: Int
    $nextToken: String
  ) {
    pharmacyInventoriesByPharmacy_id(
      pharmacy_id: $pharmacy_id
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        pharmacy_id
        global_product_id
        custom_name
        price_usd
        price_bs
        stock_quantity
        is_available
        createdAt
        updatedAt
        owner
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const pharmacyInventoriesByGlobal_product_id = /* GraphQL */ `
  query PharmacyInventoriesByGlobal_product_id(
    $global_product_id: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelPharmacyInventoryFilterInput
    $limit: Int
    $nextToken: String
  ) {
    pharmacyInventoriesByGlobal_product_id(
      global_product_id: $global_product_id
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        pharmacy_id
        global_product_id
        custom_name
        price_usd
        price_bs
        stock_quantity
        is_available
        createdAt
        updatedAt
        owner
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const pharmacyStatsByPharmacy_id = /* GraphQL */ `
  query PharmacyStatsByPharmacy_id(
    $pharmacy_id: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelPharmacyStatsFilterInput
    $limit: Int
    $nextToken: String
  ) {
    pharmacyStatsByPharmacy_id(
      pharmacy_id: $pharmacy_id
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        pharmacy_id
        total_quotes_received
        total_quotes_responded
        conversion_rate
        average_response_time
        top_medicines
        monthly_data
        updated_at
        createdAt
        updatedAt
        owner
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const searchHistoriesByUser_id = /* GraphQL */ `
  query SearchHistoriesByUser_id(
    $user_id: String!
    $sortDirection: ModelSortDirection
    $filter: ModelSearchHistoryFilterInput
    $limit: Int
    $nextToken: String
  ) {
    searchHistoriesByUser_id(
      user_id: $user_id
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        user_id
        search_term
        medicine_name
        state
        city
        created_at
        createdAt
        updatedAt
        owner
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const chatMessagesByQuote_request_id = /* GraphQL */ `
  query ChatMessagesByQuote_request_id(
    $quote_request_id: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelChatMessageFilterInput
    $limit: Int
    $nextToken: String
  ) {
    chatMessagesByQuote_request_id(
      quote_request_id: $quote_request_id
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        quote_request_id
        sender_id
        sender_type
        message
        read
        created_at
        createdAt
        updatedAt
        owner
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getExchangeRate = /* GraphQL */ `
  query GetExchangeRate($id: ID!) {
    getExchangeRate(id: $id) {
      id
      rate_bcv
      updated_at
      updated_by
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const listExchangeRates = /* GraphQL */ `
  query ListExchangeRates(
    $filter: ModelExchangeRateFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listExchangeRates(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        rate_bcv
        updated_at
        updated_by
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getPharmacyProfile = /* GraphQL */ `
  query GetPharmacyProfile($id: ID!) {
    getPharmacyProfile(id: $id) {
      id
      owner_id
      name
      rif
      phone
      whatsapp
      whatsapp_enabled
      logo_url
      cover_url
      address
      state
      city
      zone
      latitude
      longitude
      delivery_available
      pickup_available
      delivery_radius_km
      subscription_status
      subscription_expires_at
      is_verified
      verification_date
      rating_average
      total_ratings
      opening_hours
      holidays
      createdAt
      updatedAt
      owner
      __typename
    }
  }
`;
export const listPharmacyProfiles = /* GraphQL */ `
  query ListPharmacyProfiles(
    $filter: ModelPharmacyProfileFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listPharmacyProfiles(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        owner_id
        name
        rif
        phone
        whatsapp
        whatsapp_enabled
        logo_url
        cover_url
        address
        state
        city
        zone
        latitude
        longitude
        delivery_available
        pickup_available
        delivery_radius_km
        subscription_status
        subscription_expires_at
        is_verified
        verification_date
        rating_average
        total_ratings
        opening_hours
        holidays
        createdAt
        updatedAt
        owner
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getDoctorProfile = /* GraphQL */ `
  query GetDoctorProfile($id: ID!) {
    getDoctorProfile(id: $id) {
      id
      slug
      full_name
      medical_code
      primary_specialty
      sub_specialties
      photo_urls
      bio
      whatsapp
      clinic_name
      address
      state
      city
      is_vip
      vip_expires_at
      createdAt
      updatedAt
      owner
      __typename
    }
  }
`;
export const listDoctorProfiles = /* GraphQL */ `
  query ListDoctorProfiles(
    $filter: ModelDoctorProfileFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listDoctorProfiles(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        slug
        full_name
        medical_code
        primary_specialty
        sub_specialties
        photo_urls
        bio
        whatsapp
        clinic_name
        address
        state
        city
        is_vip
        vip_expires_at
        createdAt
        updatedAt
        owner
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const doctorProfilesByPrimary_specialty = /* GraphQL */ `
  query DoctorProfilesByPrimary_specialty(
    $primary_specialty: String!
    $sortDirection: ModelSortDirection
    $filter: ModelDoctorProfileFilterInput
    $limit: Int
    $nextToken: String
  ) {
    doctorProfilesByPrimary_specialty(
      primary_specialty: $primary_specialty
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        slug
        full_name
        medical_code
        primary_specialty
        sub_specialties
        photo_urls
        bio
        whatsapp
        clinic_name
        address
        state
        city
        is_vip
        vip_expires_at
        createdAt
        updatedAt
        owner
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getQuoteRequest = /* GraphQL */ `
  query GetQuoteRequest($id: ID!) {
    getQuoteRequest(id: $id) {
      id
      patient_id
      patient_name
      patient_phone
      patient_phone_verified
      medicine_name
      dosage_mg
      presentation
      quantity
      prescription_image_url
      notes
      state
      city
      zone
      latitude
      longitude
      is_guest
      max_responses_allowed
      responses_count
      pharmacy_views
      status
      urgency_level
      preferred_brands
      createdAt
      updatedAt
      owner
      __typename
    }
  }
`;
export const listQuoteRequests = /* GraphQL */ `
  query ListQuoteRequests(
    $filter: ModelQuoteRequestFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listQuoteRequests(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        patient_id
        patient_name
        patient_phone
        patient_phone_verified
        medicine_name
        dosage_mg
        presentation
        quantity
        prescription_image_url
        notes
        state
        city
        zone
        latitude
        longitude
        is_guest
        max_responses_allowed
        responses_count
        pharmacy_views
        status
        urgency_level
        preferred_brands
        createdAt
        updatedAt
        owner
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getQuoteResponse = /* GraphQL */ `
  query GetQuoteResponse($id: ID!) {
    getQuoteResponse(id: $id) {
      id
      quote_request_id
      pharmacy_id
      employee_user_id
      availability
      unit_price_usd
      total_price_usd
      delivery_cost_usd
      notes
      createdAt
      updatedAt
      owner
      __typename
    }
  }
`;
export const listQuoteResponses = /* GraphQL */ `
  query ListQuoteResponses(
    $filter: ModelQuoteResponseFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listQuoteResponses(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        quote_request_id
        pharmacy_id
        employee_user_id
        availability
        unit_price_usd
        total_price_usd
        delivery_cost_usd
        notes
        createdAt
        updatedAt
        owner
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const quoteResponsesByQuote_request_id = /* GraphQL */ `
  query QuoteResponsesByQuote_request_id(
    $quote_request_id: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelQuoteResponseFilterInput
    $limit: Int
    $nextToken: String
  ) {
    quoteResponsesByQuote_request_id(
      quote_request_id: $quote_request_id
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        quote_request_id
        pharmacy_id
        employee_user_id
        availability
        unit_price_usd
        total_price_usd
        delivery_cost_usd
        notes
        createdAt
        updatedAt
        owner
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const quoteResponsesByPharmacy_id = /* GraphQL */ `
  query QuoteResponsesByPharmacy_id(
    $pharmacy_id: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelQuoteResponseFilterInput
    $limit: Int
    $nextToken: String
  ) {
    quoteResponsesByPharmacy_id(
      pharmacy_id: $pharmacy_id
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        quote_request_id
        pharmacy_id
        employee_user_id
        availability
        unit_price_usd
        total_price_usd
        delivery_cost_usd
        notes
        createdAt
        updatedAt
        owner
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getReview = /* GraphQL */ `
  query GetReview($id: ID!) {
    getReview(id: $id) {
      id
      pharmacy_id
      user_id
      rating
      comment
      created_at
      updated_at
      createdAt
      updatedAt
      owner
      __typename
    }
  }
`;
export const listReviews = /* GraphQL */ `
  query ListReviews(
    $filter: ModelReviewFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listReviews(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        pharmacy_id
        user_id
        rating
        comment
        created_at
        updated_at
        createdAt
        updatedAt
        owner
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const reviewsByPharmacy_id = /* GraphQL */ `
  query ReviewsByPharmacy_id(
    $pharmacy_id: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelReviewFilterInput
    $limit: Int
    $nextToken: String
  ) {
    reviewsByPharmacy_id(
      pharmacy_id: $pharmacy_id
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        pharmacy_id
        user_id
        rating
        comment
        created_at
        updated_at
        createdAt
        updatedAt
        owner
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const reviewsByUser_id = /* GraphQL */ `
  query ReviewsByUser_id(
    $user_id: String!
    $sortDirection: ModelSortDirection
    $filter: ModelReviewFilterInput
    $limit: Int
    $nextToken: String
  ) {
    reviewsByUser_id(
      user_id: $user_id
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        pharmacy_id
        user_id
        rating
        comment
        created_at
        updated_at
        createdAt
        updatedAt
        owner
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getPromotion = /* GraphQL */ `
  query GetPromotion($id: ID!) {
    getPromotion(id: $id) {
      id
      pharmacy_id
      title
      description
      discount_percentage
      discount_fixed_usd
      code
      usage_count
      valid_from
      valid_to
      active
      created_at
      createdAt
      updatedAt
      owner
      __typename
    }
  }
`;
export const listPromotions = /* GraphQL */ `
  query ListPromotions(
    $filter: ModelPromotionFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listPromotions(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        pharmacy_id
        title
        description
        discount_percentage
        discount_fixed_usd
        code
        usage_count
        valid_from
        valid_to
        active
        created_at
        createdAt
        updatedAt
        owner
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const promotionsByPharmacy_id = /* GraphQL */ `
  query PromotionsByPharmacy_id(
    $pharmacy_id: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelPromotionFilterInput
    $limit: Int
    $nextToken: String
  ) {
    promotionsByPharmacy_id(
      pharmacy_id: $pharmacy_id
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        pharmacy_id
        title
        description
        discount_percentage
        discount_fixed_usd
        code
        usage_count
        valid_from
        valid_to
        active
        created_at
        createdAt
        updatedAt
        owner
        __typename
      }
      nextToken
      __typename
    }
  }
`;
