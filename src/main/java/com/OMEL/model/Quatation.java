package com.OMEL.model;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "quatation")

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Quatation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Basic(optional = false)
    @Column(name = "id")
    private Integer id;

    @Basic(optional = false)
    @Column(name = "quatationcode")
    private String quatationcode;

    @Basic(optional = false)
    @Column(name = "supplierqno")
    private String supplierqno;

    @Basic(optional = false)
    @Column(name = "receiveddate")
    private LocalDate receiveddate;

    @Basic(optional = false)
    @Column(name = "validfrom")
    private LocalDate validfrom;

    @Basic(optional = false)
    @Column(name = "validto")
    private LocalDate validto;

    @Basic(optional = false)
    @Column(name = "addeddate")
    private LocalDate addeddate;

    @Basic(optional = true)
    @Column(name = "description")
    private String description;

    @JoinColumn(name = "employee_id" , referencedColumnName = "id")
    @ManyToOne(optional = false , fetch = FetchType.EAGER)
    private Employee employee_id;

    @JoinColumn(name = "quatationrequest_id" , referencedColumnName = "id")
    @ManyToOne(optional = false , fetch = FetchType.EAGER)
    private QuatationRequset quatationrequest_id;

    @JoinColumn(name = "quatationstatus_id" , referencedColumnName = "id")
    @ManyToOne(optional = false , fetch = FetchType.EAGER)
    private QuatationStatus quatationstatus_id;

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "quatation_id" , fetch = FetchType.LAZY , orphanRemoval = true)
    private List<QuatationHasItem> quatationHasItemList;

    public Quatation(String quatationcode) {
        this.quatationcode = quatationcode;
    }
}
