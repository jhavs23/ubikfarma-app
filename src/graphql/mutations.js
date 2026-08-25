/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createExchangeRate = /* GraphQL */ `
  mutation CreateExchangeRate(
    $input: CreateExchangeRateInput!
    $condition: ModelExchangeRateConditionInput
  ) {
    createExchangeRate(input: $input, condition: $condition) {
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
export const updateExchangeRate = /* GraphQL */ `
  mutation UpdateExchangeRate(
    $input: UpdateExchangeRateInput!
    $condition: ModelExchangeRateConditionInput
  ) {
    updateExchangeRate(input: $input, condition: $condition) {
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
export const deleteExchangeRate = /* GraphQL */ `
  mutation DeleteExchangeRate(
    $input: DeleteExchangeRateInput!
    $condition: ModelExchangeRateConditionInput
  ) {
    deleteExchangeRate(input: $input, condition: $condition) {
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
export const createPharmacyProfile = /* GraphQL */ `
  mutation CreatePharmacyProfile(
    $input: CreatePharmacyProfileInput!
    $condition: ModelPharmacyProfileConditionInput
  ) {
    createPharmacyProfile(input: $input, condition: $condition) {
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
export const updatePharmacyProfile = /* GraphQL */ `
  mutation UpdatePharmacyProfile(
    $input: UpdatePharmacyProfileInput!
    $condition: ModelPharmacyProfileConditionInput
  ) {
    updatePharmacyProfile(input: $input, condition: $condition) {
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
export const deletePharmacyProfile = /* GraphQL */ `
  mutation DeletePharmacyProfile(
    $input: DeletePharmacyProfileInput!
    $condition: ModelPharmacyProfileConditionInput
  ) {
    deletePharmacyProfile(input: $input, condition: $condition) {
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
export const createDoctorProfile = /* GraphQL */ `
  mutation CreateDoctorProfile(
    $input: CreateDoctorProfileInput!
    $condition: ModelDoctorProfileConditionInput
  ) {
    createDoctorProfile(input: $input, condition: $condition) {
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
export const updateDoctorProfile = /* GraphQL */ `
  mutation UpdateDoctorProfile(
    $input: UpdateDoctorProfileInput!
    $condition: ModelDoctorProfileConditionInput
  ) {
    updateDoctorProfile(input: $input, condition: $condition) {
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
export const deleteDoctorProfile = /* GraphQL */ `
  mutation DeleteDoctorProfile(
    $input: DeleteDoctorProfileInput!
    $condition: ModelDoctorProfileConditionInput
  ) {
    deleteDoctorProfile(input: $input, condition: $condition) {
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
export const updateQuoteRequest = /* GraphQL */ `
  mutation UpdateQuoteRequest(
    $input: UpdateQuoteRequestInput!
    $condition: ModelQuoteRequestConditionInput
  ) {
    updateQuoteRequest(input: $input, condition: $condition) {
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
export const deleteQuoteRequest = /* GraphQL */ `
  mutation DeleteQuoteRequest(
    $input: DeleteQuoteRequestInput!
    $condition: ModelQuoteRequestConditionInput
  ) {
    deleteQuoteRequest(input: $input, condition: $condition) {
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
export const createQuoteResponse = /* GraphQL */ `
  mutation CreateQuoteResponse(
    $input: CreateQuoteResponseInput!
    $condition: ModelQuoteResponseConditionInput
  ) {
    createQuoteResponse(input: $input, condition: $condition) {
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
export const updateQuoteResponse = /* GraphQL */ `
  mutation UpdateQuoteResponse(
    $input: UpdateQuoteResponseInput!
    $condition: ModelQuoteResponseConditionInput
  ) {
    updateQuoteResponse(input: $input, condition: $condition) {
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
export const deleteQuoteResponse = /* GraphQL */ `
  mutation DeleteQuoteResponse(
    $input: DeleteQuoteResponseInput!
    $condition: ModelQuoteResponseConditionInput
  ) {
    deleteQuoteResponse(input: $input, condition: $condition) {
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
export const createPaymentTransaction = /* GraphQL */ `
  mutation CreatePaymentTransaction(
    $input: CreatePaymentTransactionInput!
    $condition: ModelPaymentTransactionConditionInput
  ) {
    createPaymentTransaction(input: $input, condition: $condition) {
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
export const updatePaymentTransaction = /* GraphQL */ `
  mutation UpdatePaymentTransaction(
    $input: UpdatePaymentTransactionInput!
    $condition: ModelPaymentTransactionConditionInput
  ) {
    updatePaymentTransaction(input: $input, condition: $condition) {
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
export const deletePaymentTransaction = /* GraphQL */ `
  mutation DeletePaymentTransaction(
    $input: DeletePaymentTransactionInput!
    $condition: ModelPaymentTransactionConditionInput
  ) {
    deletePaymentTransaction(input: $input, condition: $condition) {
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
export const createPharmacyEmployeeAudit = /* GraphQL */ `
  mutation CreatePharmacyEmployeeAudit(
    $input: CreatePharmacyEmployeeAuditInput!
    $condition: ModelPharmacyEmployeeAuditConditionInput
  ) {
    createPharmacyEmployeeAudit(input: $input, condition: $condition) {
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
export const updatePharmacyEmployeeAudit = /* GraphQL */ `
  mutation UpdatePharmacyEmployeeAudit(
    $input: UpdatePharmacyEmployeeAuditInput!
    $condition: ModelPharmacyEmployeeAuditConditionInput
  ) {
    updatePharmacyEmployeeAudit(input: $input, condition: $condition) {
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
export const deletePharmacyEmployeeAudit = /* GraphQL */ `
  mutation DeletePharmacyEmployeeAudit(
    $input: DeletePharmacyEmployeeAuditInput!
    $condition: ModelPharmacyEmployeeAuditConditionInput
  ) {
    deletePharmacyEmployeeAudit(input: $input, condition: $condition) {
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
export const createDistributorProfile = /* GraphQL */ `
  mutation CreateDistributorProfile(
    $input: CreateDistributorProfileInput!
    $condition: ModelDistributorProfileConditionInput
  ) {
    createDistributorProfile(input: $input, condition: $condition) {
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
export const updateDistributorProfile = /* GraphQL */ `
  mutation UpdateDistributorProfile(
    $input: UpdateDistributorProfileInput!
    $condition: ModelDistributorProfileConditionInput
  ) {
    updateDistributorProfile(input: $input, condition: $condition) {
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
export const deleteDistributorProfile = /* GraphQL */ `
  mutation DeleteDistributorProfile(
    $input: DeleteDistributorProfileInput!
    $condition: ModelDistributorProfileConditionInput
  ) {
    deleteDistributorProfile(input: $input, condition: $condition) {
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
export const createGlobalProductCatalog = /* GraphQL */ `
  mutation CreateGlobalProductCatalog(
    $input: CreateGlobalProductCatalogInput!
    $condition: ModelGlobalProductCatalogConditionInput
  ) {
    createGlobalProductCatalog(input: $input, condition: $condition) {
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
export const updateGlobalProductCatalog = /* GraphQL */ `
  mutation UpdateGlobalProductCatalog(
    $input: UpdateGlobalProductCatalogInput!
    $condition: ModelGlobalProductCatalogConditionInput
  ) {
    updateGlobalProductCatalog(input: $input, condition: $condition) {
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
export const deleteGlobalProductCatalog = /* GraphQL */ `
  mutation DeleteGlobalProductCatalog(
    $input: DeleteGlobalProductCatalogInput!
    $condition: ModelGlobalProductCatalogConditionInput
  ) {
    deleteGlobalProductCatalog(input: $input, condition: $condition) {
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
export const createPharmacyInventory = /* GraphQL */ `
  mutation CreatePharmacyInventory(
    $input: CreatePharmacyInventoryInput!
    $condition: ModelPharmacyInventoryConditionInput
  ) {
    createPharmacyInventory(input: $input, condition: $condition) {
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
export const updatePharmacyInventory = /* GraphQL */ `
  mutation UpdatePharmacyInventory(
    $input: UpdatePharmacyInventoryInput!
    $condition: ModelPharmacyInventoryConditionInput
  ) {
    updatePharmacyInventory(input: $input, condition: $condition) {
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
export const deletePharmacyInventory = /* GraphQL */ `
  mutation DeletePharmacyInventory(
    $input: DeletePharmacyInventoryInput!
    $condition: ModelPharmacyInventoryConditionInput
  ) {
    deletePharmacyInventory(input: $input, condition: $condition) {
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
export const createReview = /* GraphQL */ `
  mutation CreateReview(
    $input: CreateReviewInput!
    $condition: ModelReviewConditionInput
  ) {
    createReview(input: $input, condition: $condition) {
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
export const updateReview = /* GraphQL */ `
  mutation UpdateReview(
    $input: UpdateReviewInput!
    $condition: ModelReviewConditionInput
  ) {
    updateReview(input: $input, condition: $condition) {
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
export const deleteReview = /* GraphQL */ `
  mutation DeleteReview(
    $input: DeleteReviewInput!
    $condition: ModelReviewConditionInput
  ) {
    deleteReview(input: $input, condition: $condition) {
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
export const createPharmacyStats = /* GraphQL */ `
  mutation CreatePharmacyStats(
    $input: CreatePharmacyStatsInput!
    $condition: ModelPharmacyStatsConditionInput
  ) {
    createPharmacyStats(input: $input, condition: $condition) {
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
export const updatePharmacyStats = /* GraphQL */ `
  mutation UpdatePharmacyStats(
    $input: UpdatePharmacyStatsInput!
    $condition: ModelPharmacyStatsConditionInput
  ) {
    updatePharmacyStats(input: $input, condition: $condition) {
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
export const deletePharmacyStats = /* GraphQL */ `
  mutation DeletePharmacyStats(
    $input: DeletePharmacyStatsInput!
    $condition: ModelPharmacyStatsConditionInput
  ) {
    deletePharmacyStats(input: $input, condition: $condition) {
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
export const createSearchHistory = /* GraphQL */ `
  mutation CreateSearchHistory(
    $input: CreateSearchHistoryInput!
    $condition: ModelSearchHistoryConditionInput
  ) {
    createSearchHistory(input: $input, condition: $condition) {
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
export const updateSearchHistory = /* GraphQL */ `
  mutation UpdateSearchHistory(
    $input: UpdateSearchHistoryInput!
    $condition: ModelSearchHistoryConditionInput
  ) {
    updateSearchHistory(input: $input, condition: $condition) {
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
export const deleteSearchHistory = /* GraphQL */ `
  mutation DeleteSearchHistory(
    $input: DeleteSearchHistoryInput!
    $condition: ModelSearchHistoryConditionInput
  ) {
    deleteSearchHistory(input: $input, condition: $condition) {
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
export const createChatMessage = /* GraphQL */ `
  mutation CreateChatMessage(
    $input: CreateChatMessageInput!
    $condition: ModelChatMessageConditionInput
  ) {
    createChatMessage(input: $input, condition: $condition) {
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
export const updateChatMessage = /* GraphQL */ `
  mutation UpdateChatMessage(
    $input: UpdateChatMessageInput!
    $condition: ModelChatMessageConditionInput
  ) {
    updateChatMessage(input: $input, condition: $condition) {
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
export const deleteChatMessage = /* GraphQL */ `
  mutation DeleteChatMessage(
    $input: DeleteChatMessageInput!
    $condition: ModelChatMessageConditionInput
  ) {
    deleteChatMessage(input: $input, condition: $condition) {
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
export const createPromotion = /* GraphQL */ `
  mutation CreatePromotion(
    $input: CreatePromotionInput!
    $condition: ModelPromotionConditionInput
  ) {
    createPromotion(input: $input, condition: $condition) {
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
export const updatePromotion = /* GraphQL */ `
  mutation UpdatePromotion(
    $input: UpdatePromotionInput!
    $condition: ModelPromotionConditionInput
  ) {
    updatePromotion(input: $input, condition: $condition) {
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
export const deletePromotion = /* GraphQL */ `
  mutation DeletePromotion(
    $input: DeletePromotionInput!
    $condition: ModelPromotionConditionInput
  ) {
    deletePromotion(input: $input, condition: $condition) {
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
export const createQuoteRequest = /* GraphQL */ `
  mutation CreateQuoteRequest(
    $input: CreateQuoteRequestInput!
    $condition: ModelQuoteRequestConditionInput
  ) {
    createQuoteRequest(input: $input, condition: $condition) {
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
