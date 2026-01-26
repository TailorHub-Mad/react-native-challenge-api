const openApiSpec = {
	openapi: '3.0.3',
	info: {
		title: 'React Native API Challenge',
		version: '1.0.0',
		description:
			'API for the React Native restaurants challenge. Mobile-first auth and S3 presigned uploads.'
	},
	servers: [
		{
			url: '/api',
			description: 'Default API base URL'
		}
	],
	tags: [{ name: 'Auth' }, { name: 'Restaurants' }, { name: 'Uploads' }, { name: 'Health' }],
	components: {
		securitySchemes: {
			bearerAuth: {
				type: 'http',
				scheme: 'bearer',
				bearerFormat: 'JWT'
			}
		},
		schemas: {
			Error: {
				type: 'object',
				properties: {
					message: { type: 'string' }
				}
			},
			User: {
				type: 'object',
				properties: {
					_id: { type: 'string' },
					email: { type: 'string', format: 'email' },
					name: { type: 'string' },
					dni: { type: 'string', nullable: true },
					birthDate: { type: 'string', format: 'date-time', nullable: true },
					address: { type: 'string', nullable: true }
				}
			},
			OwnerSummary: {
				type: 'object',
				properties: {
					name: { type: 'string' }
				}
			},
			Comment: {
				type: 'object',
				properties: {
					_id: { type: 'string' },
					name: { type: 'string' },
					owner: { type: 'string', description: 'User id' },
					date: { type: 'string', format: 'date-time' },
					rating: { type: 'number', minimum: 1, maximum: 5 },
					comment: { type: 'string' }
				}
			},
			CommentPopulated: {
				type: 'object',
				properties: {
					_id: { type: 'string' },
					name: { type: 'string' },
					owner: { $ref: '#/components/schemas/OwnerSummary' },
					date: { type: 'string', format: 'date-time' },
					rating: { type: 'number', minimum: 1, maximum: 5 },
					comment: { type: 'string' }
				}
			},
			LatLng: {
				type: 'object',
				properties: {
					lat: { type: 'number' },
					lng: { type: 'number' }
				},
				required: ['lat', 'lng']
			},
			RestaurantListItem: {
				type: 'object',
				properties: {
					_id: { type: 'string' },
					name: { type: 'string' },
					owner: { type: 'string', description: 'User id' },
					address: { type: 'string' },
					image: { type: 'string', format: 'uri' },
					description: { type: 'string', nullable: true },
					latlng: { $ref: '#/components/schemas/LatLng' },
					reviews: {
						type: 'array',
						items: { $ref: '#/components/schemas/Comment' }
					},
					avgRating: { type: 'number', minimum: 0, maximum: 5 }
				}
			},
			RestaurantDetail: {
				type: 'object',
				properties: {
					_id: { type: 'string' },
					name: { type: 'string' },
					owner: { $ref: '#/components/schemas/OwnerSummary' },
					address: { type: 'string' },
					image: { type: 'string', format: 'uri' },
					description: { type: 'string', nullable: true },
					latlng: { $ref: '#/components/schemas/LatLng' },
					reviews: {
						type: 'array',
						items: { $ref: '#/components/schemas/CommentPopulated' }
					},
					avgRating: { type: 'number', minimum: 0, maximum: 5 }
				}
			},
			RestaurantListResponse: {
				type: 'object',
				properties: {
					restaurantList: {
						type: 'array',
						items: { $ref: '#/components/schemas/RestaurantListItem' }
					},
					total: { type: 'integer' }
				}
			},
			AuthResponse: {
				type: 'object',
				properties: {
					user: { $ref: '#/components/schemas/User' },
					token: { type: 'string' }
				}
			},
			PresignRequest: {
				type: 'object',
				required: ['contentType', 'sizeBytes'],
				properties: {
					contentType: { type: 'string', example: 'image/jpeg' },
					sizeBytes: { type: 'integer', example: 345678 }
				}
			},
			PresignResponse: {
				type: 'object',
				properties: {
					uploadUrl: { type: 'string', format: 'uri' },
					publicUrl: { type: 'string', format: 'uri' },
					objectKey: { type: 'string' },
					expiresIn: { type: 'integer' },
					maxSizeBytes: { type: 'integer' }
				}
			}
		}
	},
	paths: {
		'/health': {
			get: {
				tags: ['Health'],
				summary: 'Health check',
				responses: {
					'200': {
						description: 'Service is healthy'
					}
				}
			}
		},
		'/auth/signup': {
			post: {
				tags: ['Auth'],
				summary: 'Register a new user',
				requestBody: {
					required: true,
					content: {
						'application/json': {
							schema: {
								type: 'object',
								required: ['email', 'password', 'name'],
								properties: {
									email: { type: 'string', format: 'email' },
									password: { type: 'string', minLength: 6 },
									name: { type: 'string' }
								}
							}
						}
					}
				},
				responses: {
					'201': { description: 'User created' },
					'400': {
						description: 'Validation error',
						content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } }
					}
				}
			}
		},
		'/auth/login': {
			post: {
				tags: ['Auth'],
				summary: 'Login and obtain JWT',
				requestBody: {
					required: true,
					content: {
						'application/json': {
							schema: {
								type: 'object',
								required: ['email', 'password'],
								properties: {
									email: { type: 'string', format: 'email' },
									password: { type: 'string' }
								}
							}
						}
					}
				},
				responses: {
					'200': {
						description: 'Authenticated',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/AuthResponse' }
							}
						},
						headers: {
							Authorization: {
								description: 'Bearer token',
								schema: { type: 'string' }
							}
						}
					},
					'400': { description: 'Invalid credentials' }
				}
			}
		},
		'/auth/logout': {
			post: {
				tags: ['Auth'],
				summary: 'Revoke current token',
				security: [{ bearerAuth: [] }],
				responses: {
					'202': { description: 'Token revoked' },
					'401': { description: 'Unauthorized' }
				}
			}
		},
		'/auth/verify': {
			get: {
				tags: ['Auth'],
				summary: 'Verify current token',
				security: [{ bearerAuth: [] }],
				responses: {
					'200': {
						description: 'Token valid',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/User' }
							}
						}
					},
					'401': { description: 'Unauthorized' }
				}
			}
		},
		'/upload/presign': {
			post: {
				tags: ['Uploads'],
				summary: 'Create S3 presigned upload URL',
				security: [{ bearerAuth: [] }],
				requestBody: {
					required: true,
					content: {
						'application/json': {
							schema: { $ref: '#/components/schemas/PresignRequest' }
						}
					}
				},
				responses: {
					'200': {
						description: 'Presigned URL created',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/PresignResponse' }
							}
						}
					},
					'400': { description: 'Validation error' }
				}
			}
		},
		'/restaurant/list': {
			get: {
				tags: ['Restaurants'],
				summary: 'List restaurants',
				parameters: [
					{ name: 'limit', in: 'query', schema: { type: 'integer', default: 4 } },
					{ name: 'page', in: 'query', schema: { type: 'integer', default: 1 } }
				],
				responses: {
					'200': {
						description: 'Restaurant list',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/RestaurantListResponse' }
							}
						}
					}
				}
			}
		},
		'/restaurant/detail/{id}': {
			get: {
				tags: ['Restaurants'],
				summary: 'Get restaurant by id',
				parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
				responses: {
					'200': {
						description: 'Restaurant detail',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/RestaurantDetail' }
							}
						}
					},
					'404': { description: 'Not found' }
				}
			}
		},
		'/restaurant/create': {
			post: {
				tags: ['Restaurants'],
				summary: 'Create restaurant',
				security: [{ bearerAuth: [] }],
				requestBody: {
					required: true,
					content: {
						'application/json': {
							schema: {
								type: 'object',
								required: ['name', 'address', 'image', 'latlng'],
								properties: {
									name: { type: 'string' },
									address: { type: 'string' },
									image: { type: 'string', format: 'uri' },
									description: { type: 'string' },
									latlng: { $ref: '#/components/schemas/LatLng' }
								}
							}
						}
					}
				},
				responses: {
					'201': { description: 'Created' },
					'400': { description: 'Validation error' }
				}
			}
		},
		'/restaurant/{id}': {
			put: {
				tags: ['Restaurants'],
				summary: 'Update restaurant',
				security: [{ bearerAuth: [] }],
				parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
				requestBody: {
					required: true,
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									name: { type: 'string' },
									address: { type: 'string' },
									image: { type: 'string', format: 'uri' },
									description: { type: 'string' },
									latlng: { $ref: '#/components/schemas/LatLng' }
								}
							}
						}
					}
				},
				responses: {
					'202': { description: 'Updated' },
					'404': { description: 'Not found' }
				}
			},
			delete: {
				tags: ['Restaurants'],
				summary: 'Delete restaurant',
				security: [{ bearerAuth: [] }],
				parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
				responses: {
					'202': { description: 'Deleted' },
					'404': { description: 'Not found' }
				}
			}
		},
		'/restaurant/{id}/comment': {
			post: {
				tags: ['Restaurants'],
				summary: 'Create comment',
				security: [{ bearerAuth: [] }],
				parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
				requestBody: {
					required: true,
					content: {
						'application/json': {
							schema: {
								type: 'object',
								required: ['comment', 'rating'],
								properties: {
									comment: { type: 'string', minLength: 10, maxLength: 255 },
									rating: { type: 'number', minimum: 1, maximum: 5 }
								}
							}
						}
					}
				},
				responses: {
					'201': { description: 'Created' },
					'400': { description: 'Validation error' }
				}
			}
		},
		'/restaurant/{id}/comment/{commentId}': {
			put: {
				tags: ['Restaurants'],
				summary: 'Update comment',
				security: [{ bearerAuth: [] }],
				parameters: [
					{ name: 'id', in: 'path', required: true, schema: { type: 'string' } },
					{ name: 'commentId', in: 'path', required: true, schema: { type: 'string' } }
				],
				requestBody: {
					required: true,
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									comment: { type: 'string', minLength: 10, maxLength: 255 },
									rating: { type: 'number', minimum: 1, maximum: 5 }
								}
							}
						}
					}
				},
				responses: {
					'202': { description: 'Updated' },
					'404': { description: 'Not found' }
				}
			},
			delete: {
				tags: ['Restaurants'],
				summary: 'Delete comment',
				security: [{ bearerAuth: [] }],
				parameters: [
					{ name: 'id', in: 'path', required: true, schema: { type: 'string' } },
					{ name: 'commentId', in: 'path', required: true, schema: { type: 'string' } }
				],
				responses: {
					'202': { description: 'Deleted' },
					'404': { description: 'Not found' }
				}
			}
		}
	}
};

export default openApiSpec;
