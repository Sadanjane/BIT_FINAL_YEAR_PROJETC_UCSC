package com.OMEL.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Entity
@Table(name = "customerstatus")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CustomerStatus {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Basic(optional = false)
    @Column(name = "id")
    private Integer id;

    @Basic(optional = true)
    @Column(name = "name")
    private String name;

}
