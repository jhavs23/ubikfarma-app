/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreatePaymentTransaction = /* GraphQL */ `
  subscription OnCreatePaymentTransaction(
    $filter: ModelSubscriptionPaymentTransactionFilterInput
    $owner: String
  ) {
    onCreatePaymentTransaction(filter: $filter, owner: $owner) {
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
export const onUpdatePaymentTransaction = /* GraphQL */ `
  subscription OnUpdatePaymentTransaction(
    $filter: ModelSubscriptionPaymentTransactionFilterInput
    $owner: String
  ) {
    onUpdatePaymentTransaction(filter: $filter, owner: $owner) {
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
export const onDeletePaymentTransaction = /* GraphQL */ `
  subscription OnDeletePaymentTransaction(
    $filter: ModelSubscriptionPaymentTransactionFilterInput
    $owner: String
  ) {
    onDeletePaymentTransaction(filter: $filter, owner: $owner) {
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
export const onCreatePharmacyEmployeeAudit = /* GraphQL */ `
  subscription OnCreatePharmacyEmployeeAudit(
    $filter: ModelSubscriptionPharmacyEmployeeAuditFilterInput
    $owner: String
  ) {
    onCreatePharmacyEmployeeAudit(filter: $filter, owner: $owner) {
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
export const onUpdatePharmacyEmployeeAudit = /* GraphQL */ `
  subscription OnUpdatePharmacyEmployeeAudit(
    $filter: ModelSubscriptionPharmacyEmployeeAuditFilterInput
    $owner: String
  ) {
    onUpdatePharmacyEmployeeAudit(filter: $filter, owner: $owner) {
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
export const onDeletePharmacyEmployeeAudit = /* GraphQL */ `
  subscription OnDeletePharmacyEmployeeAudit(
    $filter: ModelSubscriptionPharmacyEmployeeAuditFilterInput
    $owner: String
  ) {
    onDeletePharmacyEmployeeAudit(filter: $filter, owner: $owner) {
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
export const onCreateDistributorProfile = /* GraphQL */ `
  subscription OnCreateDistributorProfile(
    $filter: ModelSubscriptionDistributorProfileFilterInput
    $owner: String
  ) {
    onCreateDistributorProfile(filter: $filter, owner: $owner) {
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
export const onUpdateDistributorProfile = /* GraphQL */ `
  subscription OnUpdateDistributorProfile(
    $filter: ModelSubscriptionDistributorProfileFilterInput
    $owner: String
  ) {
    onUpdateDistributorProfile(filter: $filter, owner: $owner) {
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
export const onDeleteDistributorProfile = /* GraphQL */ `
  subscription OnDeleteDistributorProfile(
    $filter: ModelSubscriptionDistributorProfileFilterInput
    $owner: String
  ) {
    onDeleteDistributorProfile(filter: $filter, owner: $owner) {
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
export const onCreateGlobalProductCatalog = /* GraphQL */ `
  subscription OnCreateGlobalProductCatalog(
    $filter: ModelSubscriptionGlobalProductCatalogFilterInput
  ) {
    onCreateGlobalProductCatalog(filter: $filter) {
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
export const onUpdateGlobalProductCatalog = /* GraphQL */ `
  subscription OnUpdateGlobalProductCatalog(
    $filter: ModelSubscriptionGlobalProductCatalogFilterInput
  ) {
    onUpdateGlobalProductCatalog(filter: $filter) {
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
export const onDeleteGlobalProductCatalog = /* GraphQL */ `
  subscription OnDeleteGlobalProductCatalog(
    $filter: ModelSubscriptionGlobalProductCatalogFilterInput
  ) {
    onDeleteGlobalProductCatalog(filter: $filter) {
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
export const onCreatePharmacyInventory = /* GraphQL */ `
  subscription OnCreatePharmacyInventory(
    $filter: ModelSubscriptionPharmacyInventoryFilterInput
    $owner: String
  ) {
    onCreatePharmacyInventory(filter: $filter, owner: $owner) {
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
export const onUpdatePharmacyInventory = /* GraphQL */ `
  subscription OnUpdatePharmacyInventory(
    $filter: ModelSubscriptionPharmacyInventoryFilterInput
    $owner: String
  ) {
    onUpdatePharmacyInventory(filter: $filter, owner: $owner) {
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
export const onDeletePharmacyInventory = /* GraphQL */ `
  subscription OnDeletePharmacyInventory(
    $filter: ModelSubscriptionPharmacyInventoryFilterInput
    $owner: String
  ) {
    onDeletePharmacyInventory(filter: $filter, owner: $owner) {
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
export const onCreatePharmacyStats = /* GraphQL */ `
  subscription OnCreatePharmacyStats(
    $filter: ModelSubscriptionPharmacyStatsFilterInput
    $owner: String
  ) {
    onCreatePharmacyStats(filter: $filter, owner: $owner) {
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
export const onUpdatePharmacyStats = /* GraphQL */ `
  subscription OnUpdatePharmacyStats(
    $filter: ModelSubscriptionPharmacyStatsFilterInput
    $owner: String
  ) {
    onUpdatePharmacyStats(filter: $filter, owner: $owner) {
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
export const onDeletePharmacyStats = /* GraphQL */ `
  subscription OnDeletePharmacyStats(
    $filter: ModelSubscriptionPharmacyStatsFilterInput
    $owner: String
  ) {
    onDeletePharmacyStats(filter: $filter, owner: $owner) {
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
export const onCreateSearchHistory = /* GraphQL */ `
  subscription OnCreateSearchHistory(
    $filter: ModelSubscriptionSearchHistoryFilterInput
    $owner: String
  ) {
    onCreateSearchHistory(filter: $filter, owner: $owner) {
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
export const onUpdateSearchHistory = /* GraphQL */ `
  subscription OnUpdateSearchHistory(
    $filter: ModelSubscriptionSearchHistoryFilterInput
    $owner: String
  ) {
    onUpdateSearchHistory(filter: $filter, owner: $owner) {
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
export const onDeleteSearchHistory = /* GraphQL */ `
  subscription OnDeleteSearchHistory(
    $filter: ModelSubscriptionSearchHistoryFilterInput
    $owner: String
  ) {
    onDeleteSearchHistory(filter: $filter, owner: $owner) {
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
export const onCreateChatMessage = /* GraphQL */ `
  subscription OnCreateChatMessage(
    $filter: ModelSubscriptionChatMessageFilterInput
    $owner: String
  ) {
    onCreateChatMessage(filter: $filter, owner: $owner) {
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
export const onUpdateChatMessage = /* GraphQL */ `
  subscription OnUpdateChatMessage(
    $filter: ModelSubscriptionChatMessageFilterInput
    $owner: String
  ) {
    onUpdateChatMessage(filter: $filter, owner: $owner) {
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
export const onDeleteChatMessage = /* GraphQL */ `
  subscription OnDeleteChatMessage(
    $filter: ModelSubscriptionChatMessageFilterInput
    $owner: String
  ) {
    onDeleteChatMessage(filter: $filter, owner: $owner) {
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
export const onCreateExchangeRate = /* GraphQL */ `
  subscription OnCreateExchangeRate(
    $filter: ModelSubscriptionExchangeRateFilterInput
  ) {
    onCreateExchangeRate(filter: $filter) {
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
export const onUpdateExchangeRate = /* GraphQL */ `
  subscription OnUpdateExchangeRate(
    $filter: ModelSubscriptionExchangeRateFilterInput
  ) {
    onUpdateExchangeRate(filter: $filter) {
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
export const onDeleteExchangeRate = /* GraphQL */ `
  subscription OnDeleteExchangeRate(
    $filter: ModelSubscriptionExchangeRateFilterInput
  ) {
    onDeleteExchangeRate(filter: $filter) {
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
export const onCreatePharmacyProfile = /* GraphQL */ `
  subscription OnCreatePharmacyProfile(
    $filter: ModelSubscriptionPharmacyProfileFilterInput
    $owner: String
  ) {
    onCreatePharmacyProfile(filter: $filter, owner: $owner) {
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
export const onUpdatePharmacyProfile = /* GraphQL */ `
  subscription OnUpdatePharmacyProfile(
    $filter: ModelSubscriptionPharmacyProfileFilterInput
    $owner: String
  ) {
    onUpdatePharmacyProfile(filter: $filter, owner: $owner) {
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
export const onDeletePharmacyProfile = /* GraphQL */ `
  subscription OnDeletePharmacyProfile(
    $filter: ModelSubscriptionPharmacyProfileFilterInput
    $owner: String
  ) {
    onDeletePharmacyProfile(filter: $filter, owner: $owner) {
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
export const onCreateDoctorProfile = /* GraphQL */ `
  subscription OnCreateDoctorProfile(
    $filter: ModelSubscriptionDoctorProfileFilterInput
    $owner: String
  ) {
    onCreateDoctorProfile(filter: $filter, owner: $owner) {
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
export const onUpdateDoctorProfile = /* GraphQL */ `
  subscription OnUpdateDoctorProfile(
    $filter: ModelSubscriptionDoctorProfileFilterInput
    $owner: String
  ) {
    onUpdateDoctorProfile(filter: $filter, owner: $owner) {
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
export const onDeleteDoctorProfile = /* GraphQL */ `
  subscription OnDeleteDoctorProfile(
    $filter: ModelSubscriptionDoctorProfileFilterInput
    $owner: String
  ) {
    onDeleteDoctorProfile(filter: $filter, owner: $owner) {
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
export const onCreateQuoteRequest = /* GraphQL */ `
  subscription OnCreateQuoteRequest(
    $filter: ModelSubscriptionQuoteRequestFilterInput
    $owner: String
  ) {
    onCreateQuoteRequest(filter: $filter, owner: $owner) {
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
export const onUpdateQuoteRequest = /* GraphQL */ `
  subscription OnUpdateQuoteRequest(
    $filter: ModelSubscriptionQuoteRequestFilterInput
    $owner: String
  ) {
    onUpdateQuoteRequest(filter: $filter, owner: $owner) {
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
export const onDeleteQuoteRequest = /* GraphQL */ `
  subscription OnDeleteQuoteRequest(
    $filter: ModelSubscriptionQuoteRequestFilterInput
    $owner: String
  ) {
    onDeleteQuoteRequest(filter: $filter, owner: $owner) {
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
export const onCreateQuoteResponse = /* GraphQL */ `
  subscription OnCreateQuoteResponse(
    $filter: ModelSubscriptionQuoteResponseFilterInput
    $owner: String
  ) {
    onCreateQuoteResponse(filter: $filter, owner: $owner) {
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
export const onUpdateQuoteResponse = /* GraphQL */ `
  subscription OnUpdateQuoteResponse(
    $filter: ModelSubscriptionQuoteResponseFilterInput
    $owner: String
  ) {
    onUpdateQuoteResponse(filter: $filter, owner: $owner) {
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
export const onDeleteQuoteResponse = /* GraphQL */ `
  subscription OnDeleteQuoteResponse(
    $filter: ModelSubscriptionQuoteResponseFilterInput
    $owner: String
  ) {
    onDeleteQuoteResponse(filter: $filter, owner: $owner) {
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
export const onCreateReview = /* GraphQL */ `
  subscription OnCreateReview(
    $filter: ModelSubscriptionReviewFilterInput
    $owner: String
  ) {
    onCreateReview(filter: $filter, owner: $owner) {
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
export const onUpdateReview = /* GraphQL */ `
  subscription OnUpdateReview(
    $filter: ModelSubscriptionReviewFilterInput
    $owner: String
  ) {
    onUpdateReview(filter: $filter, owner: $owner) {
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
export const onDeleteReview = /* GraphQL */ `
  subscription OnDeleteReview(
    $filter: ModelSubscriptionReviewFilterInput
    $owner: String
  ) {
    onDeleteReview(filter: $filter, owner: $owner) {
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
export const onCreatePromotion = /* GraphQL */ `
  subscription OnCreatePromotion(
    $filter: ModelSubscriptionPromotionFilterInput
    $owner: String
  ) {
    onCreatePromotion(filter: $filter, owner: $owner) {
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
export const onUpdatePromotion = /* GraphQL */ `
  subscription OnUpdatePromotion(
    $filter: ModelSubscriptionPromotionFilterInput
    $owner: String
  ) {
    onUpdatePromotion(filter: $filter, owner: $owner) {
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
export const onDeletePromotion = /* GraphQL */ `
  subscription OnDeletePromotion(
    $filter: ModelSubscriptionPromotionFilterInput
    $owner: String
  ) {
    onDeletePromotion(filter: $filter, owner: $owner) {
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
